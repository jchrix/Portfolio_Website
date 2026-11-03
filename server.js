import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { spawn } from 'node:child_process';
import { resolveProjectPath } from './scripts/project-paths.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const isDev = args.includes('--dev') || process.env.NODE_ENV === 'development';
const shouldOpen = args.includes('--open');
const portArg = args.find((argument) => argument.startsWith('--port='));
const requestedPort = portArg
  ? Number(portArg.slice('--port='.length))
  : Number(process.env.PORT || 3000);
if (!Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) {
  throw new Error(`Invalid port: ${requestedPort}`);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.framercms': 'application/octet-stream',
  '.bin': 'application/octet-stream',
  '.lottie': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const cdnMapPath = path.join(rootDir, 'framer-cdn-map.json');
let cdnMap;
try {
  cdnMap = JSON.parse(fs.readFileSync(cdnMapPath, 'utf8'));
} catch (error) {
  throw new Error(`Could not load framer-cdn-map.json: ${error.message}`, { cause: error });
}
if (!cdnMap || typeof cdnMap !== 'object' || Array.isArray(cdnMap)) {
  throw new Error('framer-cdn-map.json must contain a JSON object.');
}

// Redirects mapping (from serve.json / _redirects)
const REDIRECTS = {
  '/keepit.html': '/case-studies/keepit/',
  '/google-transtale.html': '/case-studies/google-transtale/',
  '/rislly.html': '/case-studies/rislly/',
  '/opnr.html': '/case-studies/opnr/',
  '/girintec.html': '/case-studies/girintec/',
  '/what-is-an-experience.html': '/blog/what-is-an-experience/'
};

// Live reload SSE client list
const sseClients = new Set();

function broadcastReload() {
  if (sseClients.size === 0) return;
  for (const res of sseClients) {
    try {
      res.write('data: reload\n\n');
    } catch {
      sseClients.delete(res);
    }
  }
}

// Live-reload injection snippet
const LIVE_RELOAD_SCRIPT = `
<!-- Live Reload Client -->
<script>
(function() {
  var es = new EventSource('/__livereload');
  es.onmessage = function(e) {
    if (e.data === 'reload') {
      console.log('[LiveReload] Change detected, reloading page...');
      location.reload();
    }
  };
  es.onerror = function() {
    setTimeout(function() { location.reload(); }, 2500);
  };
})();
</script>
`;

function resolveFilePath(reqUrl) {
  const urlObj = new URL(reqUrl, 'http://localhost');
  let pathname = decodeURIComponent(urlObj.pathname);

  // 1. Check direct redirects
  if (REDIRECTS[pathname]) {
    return { redirect: REDIRECTS[pathname] };
  }

  if (typeof cdnMap[pathname] === 'string') {
    const target = cdnMap[pathname];
    const resolvedPath = resolveProjectPath(rootDir, target.replace(/^[/\\]+/, ''));
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      return { filePath: resolvedPath, searchParams: urlObj.searchParams };
    }
  }

  if (pathname.startsWith('/cms/') && pathname.endsWith('.framercms')) {
    const filename = path.basename(pathname);
    const assetPath = resolveProjectPath(rootDir, path.join('assets', filename));
    if (assetPath && fs.existsSync(assetPath)) {
      return { filePath: assetPath, searchParams: urlObj.searchParams };
    }
  }

  const relPath = pathname.replace(/^[/\\]+/, '');
  const fullPath = resolveProjectPath(rootDir, relPath);
  if (!fullPath) return { notFound: true };

  if (pathname === '/' || pathname === '') {
    return { filePath: path.join(rootDir, 'index.html'), searchParams: urlObj.searchParams };
  }
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const indexPath = path.join(fullPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return { filePath: indexPath, searchParams: urlObj.searchParams };
    }
  } else if (!fs.existsSync(fullPath)) {
    const asDir = resolveProjectPath(rootDir, path.join(relPath, 'index.html'));
    if (asDir && fs.existsSync(asDir)) {
      return { filePath: asDir, searchParams: urlObj.searchParams };
    }

    const asHtml = resolveProjectPath(rootDir, `${relPath}.html`);
    if (asHtml && fs.existsSync(asHtml)) {
      return { filePath: asHtml, searchParams: urlObj.searchParams };
    }

    const exts = ['.svg', '.png', '.jpg', '.webp', '.avif'];
    for (const ext of exts) {
      const candidate = resolveProjectPath(rootDir, `${relPath}${ext}`);
      if (candidate && fs.existsSync(candidate)) {
        return { filePath: candidate, searchParams: urlObj.searchParams };
      }
    }
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return { filePath: fullPath, searchParams: urlObj.searchParams };
  }

  return { notFound: true };
}

function serveFileWithRange(req, res, filePath, searchParams, isGzipSupported) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  let rangeHeader = req.headers['range'];
  const queryRange = searchParams ? searchParams.get('range') : null;

  if (queryRange && !rangeHeader) {
    rangeHeader = `bytes=${queryRange}`;
  }

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const relativePath = path.relative(rootDir, filePath);
  const pathSegments = relativePath.split(path.sep);
  const isImmutableAsset = path.basename(filePath).startsWith('chunk-')
    || pathSegments.includes('fonts')
    || pathSegments.includes('images');
  if (!isDev && isImmutableAsset) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }

  if (ext === '.html') {
    let content = fs.readFileSync(filePath, 'utf8');
    if (isDev) {
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${LIVE_RELOAD_SCRIPT}</body>`);
      } else {
        content += LIVE_RELOAD_SCRIPT;
      }
    }

    res.setHeader('Content-Type', contentType);
    const buf = Buffer.from(content, 'utf8');

    if (isGzipSupported && buf.length > 1024) {
      zlib.gzip(buf, (err, compressed) => {
        if (err) {
          console.error('Could not gzip HTML response:', err);
          res.statusCode = 500;
          return res.end('Internal Server Error');
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', compressed.length);
        res.writeHead(200);
        res.end(compressed);
      });
    } else {
      res.setHeader('Content-Length', buf.length);
      res.writeHead(200);
      res.end(buf);
    }
    return;
  }

  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    let start;
    let end;
    if (match && stat.size > 0 && (match[1] || match[2])) {
      if (match[1]) {
        start = Number(match[1]);
        end = match[2] ? Number(match[2]) : stat.size - 1;
      } else {
        const suffixLength = Number(match[2]);
        start = Math.max(stat.size - suffixLength, 0);
        end = stat.size - 1;
      }
      end = Math.min(end, stat.size - 1);
    }

    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)
      || start < 0 || start > end || start >= stat.size) {
      res.setHeader('Content-Range', `bytes */${stat.size}`);
      res.writeHead(416, { 'Content-Type': 'text/plain' });
      return res.end('Requested range not satisfiable');
    }

    const chunkSize = end - start + 1;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.setHeader('Content-Length', chunkSize);
    res.setHeader('Content-Type', contentType);
    res.writeHead(206);

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
    return;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', stat.size);
  res.writeHead(200);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  const isGzipSupported = (req.headers['accept-encoding'] || '').includes('gzip');

  let requestUrl;
  try {
    requestUrl = new URL(req.url || '/', 'http://localhost');
  } catch (error) {
    console.error('Invalid request URL:', error);
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad Request');
  }

  if (isDev && requestUrl.pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('data: connected\n\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  if (requestUrl.pathname === '/__health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
  }

  let resolved;
  try {
    resolved = resolveFilePath(req.url || '/');
  } catch (error) {
    const isBadUrl = error instanceof URIError;
    console.error('Could not resolve request path:', error);
    res.writeHead(isBadUrl ? 400 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(isBadUrl ? 'Bad Request' : 'Internal Server Error');
  }

  if (resolved.redirect) {
    res.writeHead(301, { Location: resolved.redirect });
    return res.end();
  }

  if (resolved.notFound) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>404 Not Found</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0b0b; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          h1 { font-size: 48px; margin: 0 0 16px 0; color: #f59f00; }
          p { color: #888; font-size: 18px; margin: 0 0 24px 0; }
          a { color: #f59f00; text-decoration: none; border: 1px solid #f59f00; padding: 10px 20px; border-radius: 8px; transition: all 0.2s; }
          a:hover { background: #f59f00; color: #000; }
        </style>
      </head>
      <body>
        <div>
          <h1>404</h1>
          <p>Page or asset not found: <code>${escapeHtml(req.url || '/')}</code></p>
          <a href="/">← Return to Portfolio</a>
        </div>
      </body>
      </html>
    `);
  }

  try {
    serveFileWithRange(req, res, resolved.filePath, resolved.searchParams, isGzipSupported);
  } catch (err) {
    console.error('Server error handling request:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

if (isDev) {
  let debounceTimer = null;
  const watchDirs = ['', 'blog', 'case-studies', 'contact', 'assets'];

  for (const dir of watchDirs) {
    const fullDir = path.join(rootDir, dir);
    if (fs.existsSync(fullDir)) {
      try {
        fs.watch(fullDir, { recursive: true }, (eventType, filename) => {
          if (!filename) return;
          if (filename.includes('node_modules') || filename.startsWith('.')) return;
          if (filename.endsWith('.tmp') || filename.endsWith('.log')) return;

          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            console.log(`⚡ [LiveReload] Detected change in ${filename}, refreshing...`);
            broadcastReload();
          }, 150);
        });
      } catch (e) {
        console.warn(`Watch not supported for ${dir}:`, e.message);
      }
    }
  }
}

function startServer(port) {
  server.listen(port, () => {
    const localUrl = `http://localhost:${port}`;
    console.log(`\n======================================================`);
    console.log(`  🚀 Christian Jeremiah Portfolio Web App`);
    console.log(`  Mode:        ${isDev ? 'Development (Hot Live-Reload ON)' : 'Production'}`);
    console.log(`  Local URL:   ${localUrl}`);
    console.log(`  CMS & MIME:  Active (Full Byte-Range & MJS support)`);
    console.log(`======================================================\n`);

    if (shouldOpen) {
      openBrowser(localUrl);
    }
  });

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port === 65535) {
        console.error('Could not find an available port.');
        process.exitCode = 1;
        return;
      }
      console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server startup error:', err);
      process.exitCode = 1;
    }
  });
}

function openBrowser(targetUrl) {
  const command = process.platform === 'win32'
    ? ['cmd.exe', ['/c', 'start', '', targetUrl]]
    : process.platform === 'darwin'
      ? ['open', [targetUrl]]
      : ['xdg-open', [targetUrl]];
  const child = spawn(command[0], command[1], { detached: true, stdio: 'ignore' });
  child.on('error', (error) => {
    console.warn('Could not automatically launch browser:', error.message);
  });
  child.unref();
}

startServer(requestedPort);
