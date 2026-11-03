import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REQUIRED_PAGES } from './site-config.js';
import { resolveProjectPath } from './project-paths.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

console.log('🔍 Running asset and route integrity check for Christian Jeremiah Portfolio...\n');

const cdnMapPath = path.join(rootDir, 'framer-cdn-map.json');
let cdnMap;
try {
  cdnMap = JSON.parse(fs.readFileSync(cdnMapPath, 'utf8'));
} catch (error) {
  console.error(`❌ Could not load framer-cdn-map.json: ${error.message}`);
  process.exit(1);
}
if (!cdnMap || typeof cdnMap !== 'object' || Array.isArray(cdnMap)) {
  console.error('❌ framer-cdn-map.json must contain a JSON object.');
  process.exit(1);
}
console.log(`📋 framer-cdn-map.json loaded: ${Object.keys(cdnMap).length} entries.`);

let missingCdnTargets = 0;
for (const [key, target] of Object.entries(cdnMap)) {
  if (typeof target !== 'string') {
    console.error(`❌ Invalid CDN target for ${key}: expected a string.`);
    missingCdnTargets++;
    continue;
  }
  const fullPath = resolveProjectPath(rootDir, target.replace(/^[/\\]+/, ''));
  if (!fullPath || !fs.existsSync(fullPath)) {
    console.error(`❌ Missing CDN target file on disk: ${target} (mapped from ${key})`);
    missingCdnTargets++;
  }
}

if (missingCdnTargets === 0) {
  console.log('✅ All CDN map target files exist on disk!');
} else {
  console.warn(`⚠️ ${missingCdnTargets} CDN targets were missing on disk.`);
}

let checkedRefs = 0;
let missingRefs = 0;

for (const { path: htmlRel } of REQUIRED_PAGES) {
  const htmlFull = path.join(rootDir, htmlRel);
  if (!fs.existsSync(htmlFull)) {
    console.error(`❌ HTML file missing: ${htmlRel}`);
    missingRefs++;
    continue;
  }

  const content = fs.readFileSync(htmlFull, 'utf8');
  const matches = content.matchAll(/(?:src|href)=["'](\/[^"'?#\s]+)/g);
  for (const m of matches) {
    const rawRef = m[1];
    checkedRefs++;

    const directPath = resolveProjectPath(rootDir, rawRef.slice(1));
    const indexPath = directPath && resolveProjectPath(rootDir, path.join(rawRef.slice(1), 'index.html'));
    const isDirIndex = Boolean(indexPath && fs.existsSync(indexPath));
    const isDirect = Boolean(directPath && fs.existsSync(directPath));
    const mapped = cdnMap[rawRef];
    const mappedPath = typeof mapped === 'string'
      ? resolveProjectPath(rootDir, mapped.replace(/^[/\\]+/, ''))
      : null;
    const isMapped = Boolean(mappedPath && fs.existsSync(mappedPath));

    if (!isDirect && !isDirIndex && !isMapped) {
      console.warn(`⚠️ Unresolved reference in ${htmlRel}: ${rawRef}`);
      missingRefs++;
    }
  }
}

console.log(`\n📊 Reference check summary:`);
console.log(`   Total checked references: ${checkedRefs}`);
console.log(`   Missing / unresolved:     ${missingRefs}`);

if (missingRefs === 0 && missingCdnTargets === 0) {
  console.log('\n✨ Asset and route integrity check passed with 100% success!\n');
} else {
  console.error('\n❌ Asset and route integrity check failed.\n');
  process.exitCode = 1;
}
