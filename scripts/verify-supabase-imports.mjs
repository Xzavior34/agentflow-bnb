import fs from 'fs';
import path from 'path';

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scan(p);
    } else if ((f.endsWith('.ts') || f.endsWith('.tsx')) && !p.includes('_archive') && !p.includes('integrations\\supabase')) {
      const content = fs.readFileSync(p, 'utf8');
      if (content.includes('supabase')) {
        console.log('FOUND ACTIVE SUPABASE IMPORT IN:', p);
      }
    }
  }
}

console.log('Scanning active production files in src/...');
scan('src');
console.log('Scan complete.');
