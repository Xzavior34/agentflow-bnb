import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE';

const SEARCH_TERMS = [
  'Agent Market',
  'AgentMarket',
  'Cronos',
  'zkEVM',
  'TCRO',
  'CRO',
  'hackathon',
  'prize',
  'demo',
  'mock',
  'fake',
  'sample',
  'placeholder',
  'Lorem',
  'hardcoded',
  '338',
  '2818',
  '240',
];

const IGNORE_DIRS = ['.git', 'node_modules', 'dist', '.system_generated', 'scratch', '.gemini'];
const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.map'];

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (IGNORE_DIRS.some(d => filePath.includes(path.sep + d) || filePath.endsWith(path.sep + d))) {
      continue;
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (!IGNORE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const allFiles = walkDir(rootDir);
console.log(`Scanning ${allFiles.length} files for legacy terms...`);

const findings = [];

for (const filePath of allFiles) {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      for (const term of SEARCH_TERMS) {
        const regex = new RegExp(`\\b${term}\\b|${term}`, 'i');
        if (regex.test(line)) {
          findings.push({
            file: relPath,
            line: index + 1,
            term: term,
            content: line.trim(),
          });
        }
      }
    });
  } catch (e) {
    // Binary or unreadable file
  }
}

console.log(`Found ${findings.length} matches across codebase.`);

// Categorize findings
const auditOutput = [];
auditOutput.push('# Legacy Terminology & Code Audit Report');
auditOutput.push(`\nTotal Files Scanned: ${allFiles.length}`);
auditOutput.push(`Total Occurrences Detected: ${findings.length}\n`);

auditOutput.push('## Classification Summary\n');
auditOutput.push('| Category | Action | Description |');
auditOutput.push('| :--- | :--- | :--- |');
auditOutput.push('| **REMOVE** | Delete from codebase | Obsolete demo routes, fake metrics, abandoned hackathon copy |');
auditOutput.push('| **REPLACE** | Update to AgentFlow / BNB | Brand names, titles, meta tags, hero copy, navigations |');
auditOutput.push('| **ARCHIVE** | Move to docs / history | Historical research notes and Phase 1-3 audit records |');
auditOutput.push('| **LEGITIMATE TEST FIXTURE** | Retain in `test/` | Isolated unit test fixtures verifying parsers / validators |');
auditOutput.push('| **CURRENT PRODUCTION** | Verified Active | Live BNB Chain / BSC contracts, 8004scan integration |');

auditOutput.push('\n## Detailed Audit Findings\n');
auditOutput.push('| File | Line | Matched Term | Code Snippet | Classification |');
auditOutput.push('| :--- | :--- | :--- | :--- | :--- |');

findings.forEach(f => {
  let classification = 'REPLACE';
  if (f.file.includes('test') || f.file.includes('fixtures')) {
    classification = 'LEGITIMATE TEST FIXTURE';
  } else if (f.file.startsWith('docs/')) {
    classification = 'ARCHIVE';
  } else if (f.content.toLowerCase().includes('demo') || f.content.toLowerCase().includes('mock') || f.file.includes('Demo')) {
    classification = 'REMOVE';
  } else if (f.term.toLowerCase().includes('cronos') || f.term.toLowerCase().includes('tcro') || f.term.toLowerCase().includes('agent market')) {
    classification = 'REPLACE';
  }
  const cleanSnippet = f.content.replace(/\|/g, '\\|').substring(0, 80);
  auditOutput.push(`| \`${f.file}\` | ${f.line} | \`${f.term}\` | \`${cleanSnippet}\` | **${classification}** |`);
});

fs.writeFileSync(path.join(rootDir, 'docs', 'LEGACY_REMOVAL_AUDIT.md'), auditOutput.join('\n'));
console.log('Saved audit report to docs/LEGACY_REMOVAL_AUDIT.md');
