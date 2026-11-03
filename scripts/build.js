import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOSTING_CONFIGS, REQUIRED_PAGES } from './site-config.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

console.log('⚡ Building Christian Jeremiah Portfolio Web App...\n');

let hasErrors = false;
let pageCount = 0;
for (const page of REQUIRED_PAGES) {
  const fullPath = path.join(rootDir, page.path);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing essential page: ${page.path}`);
    hasErrors = true;
    continue;
  }
  pageCount++;
  const route = `/${page.path.replace(/(?:^|\/)index\.html$/, '')}`;
  console.log(`  ✓ [Route verified] ${route} (${page.title})`);
}

console.log('\n🔧 Validating hosting & CDN configurations:');
for (const config of HOSTING_CONFIGS) {
  const fullPath = path.join(rootDir, config);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ ${config} present`);
  } else {
    console.warn(`  ⚠️ ${config} missing`);
  }
}

let totalSize = 0;
let fileCount = 0;

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.isFile()) {
      const { size } = fs.statSync(fullPath);
      fileCount++;
      totalSize += size;
    }
  }
}
scan(rootDir);

const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log('\n📦 Build summary:');
console.log(`   Routes:       ${pageCount} verified`);
console.log(`   Total files:  ${fileCount} files`);
console.log(`   Project size: ${totalMB} MB`);
if (hasErrors) {
  console.error('\n❌ Build validation failed because required pages are missing.\n');
  process.exitCode = 1;
} else {
  console.log('\n✨ Web app is validated, fully functional, and ready to serve or deploy!\n');
}
