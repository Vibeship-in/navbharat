const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'));
const output = path.join(root, 'dist');
// Publish only the application. Never expose repository documents or backups.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'index.html'), html);
fs.copyFileSync(path.join(root, 'assets', 'og-image.png'), path.join(output, 'og-image.png'));
console.log('Prepared dist/index.html; public OG image included; no private project files published.');
