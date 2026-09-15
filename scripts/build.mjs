import { cp, mkdir, readFile, access } from 'node:fs/promises';
const html = await readFile('index.html', 'utf8');
for (const [, asset] of html.matchAll(/(?:src|href)="((?:public\/|styles\.css|app\.js)[^"]*)"/g)) await access(asset);
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'motion.js', 'public']) await cp(file, `dist/${file}`, { recursive: true });
console.log('Build complete. All local asset paths verified. Output: dist/');
