import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';

function checkImports(componentName) {
  const files = [];
  function scan(dir) {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(componentName)) {
          files.push(path.relative(rootDir, fullPath));
        }
      }
    }
  }
  scan(rootDir);
  return files;
}

console.log('DemoConsole:', checkImports('DemoConsole'));
console.log('TransactionFeed:', checkImports('TransactionFeed'));
console.log('ServiceCard:', checkImports('ServiceCard'));
console.log('TerminalLog:', checkImports('TerminalLog'));
console.log('X402FlowDiagram:', checkImports('X402FlowDiagram'));
