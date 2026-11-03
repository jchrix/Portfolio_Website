import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const replacements = [
  [/href=(["'])keepit\.html/g, 'href=$1/case-studies/keepit/'],
  [/href=(["'])google-transtale\.html/g, 'href=$1/case-studies/google-transtale/'],
  [/href=(["'])rislly\.html/g, 'href=$1/case-studies/rislly/'],
  [/href=(["'])opnr\.html/g, 'href=$1/case-studies/opnr/'],
  [/href=(["'])girintec\.html/g, 'href=$1/case-studies/girintec/'],
  [/href=(["'])what-is-an-experience\.html/g, 'href=$1/blog/what-is-an-experience/'],
  [/href=(["'])index\.html#/g, 'href=$1/#'],
  [/href=(["'])index\.html\1/g, 'href=$1/']
];

const changedFiles = [];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      processDir(full);
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      const original = fs.readFileSync(full, 'utf8');
      let updated = original;
      for (const [pattern, replacement] of replacements) {
        updated = updated.replace(pattern, replacement);
      }
      if (updated !== original) {
        fs.writeFileSync(full, updated, 'utf8');
        changedFiles.push(path.relative(rootDir, full));
      }
    }
  }
}

processDir(rootDir);

if (changedFiles.length > 0) {
  console.log(`Updated link routes in ${changedFiles.length} file(s):`);
  for (const f of changedFiles) {
    console.log(`  - ${f}`);
  }
} else {
  console.log('✨ All HTML internal link routes are already clean and optimized!');
}
