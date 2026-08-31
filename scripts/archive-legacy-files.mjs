import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/src';
const archiveDir = path.join(rootDir, '_archive');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

const filesToArchive = [
  path.join(rootDir, 'pages', 'Demo.tsx'),
  path.join(rootDir, 'pages', 'Register.tsx'),
  path.join(rootDir, 'pages', 'Marketplace.tsx'),
  path.join(rootDir, 'components', 'DemoConsole.tsx'),
  path.join(rootDir, 'components', 'TransactionFeed.tsx'),
  path.join(rootDir, 'components', 'ServiceCard.tsx'),
  path.join(rootDir, 'components', 'TerminalLog.tsx'),
  path.join(rootDir, 'components', 'X402FlowDiagram.tsx'),
];

for (const file of filesToArchive) {
  if (fs.existsSync(file)) {
    const dest = path.join(archiveDir, path.basename(file));
    fs.renameSync(file, dest);
    console.log(`Archived ${path.basename(file)} -> src/_archive/`);
  }
}
