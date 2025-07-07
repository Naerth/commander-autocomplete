import fs from 'fs';
import path from 'path';

const summaryPath = path.resolve('coverage/coverage-summary.json');
const readmePath = path.resolve('README.md');

if (!fs.existsSync(summaryPath)) {
    console.error('❌ coverage-summary.json not found. Run coverage first.');
    process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
const coveragePct = Math.round(summary.total.lines.pct);

const color =
    coveragePct >= 90 ? 'brightgreen' :
        coveragePct >= 75 ? 'yellow' :
            coveragePct >= 50 ? 'orange' :
                'red';

const badgeUrl = `https://img.shields.io/badge/coverage-${coveragePct}%25-${color}`;
const badgeMarkdown = `![coverage](${badgeUrl})`;

if (!fs.existsSync(readmePath)) {
    console.error('❌ README.md not found.');
    process.exit(1);
}

let readme = fs.readFileSync(readmePath, 'utf-8');

const startTag = '<!-- coverage-badge-start -->';
const endTag = '<!-- coverage-badge-end -->';

const badgeBlockRegex = new RegExp(
    `${startTag}[\\s\\S]*?${endTag}`,
    'm'
);

const newBlock = `${startTag}\n${badgeMarkdown}\n${endTag}`;

if (badgeBlockRegex.test(readme)) {
    readme = readme.replace(badgeBlockRegex, newBlock);
} else {
    // Fallback: append at the top
    readme = `${newBlock}\n\n${readme}`;
}

fs.writeFileSync(readmePath, readme);
console.log(`✅ Coverage badge updated to ${coveragePct}%`);
