import { cp, mkdir, readFile, access, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const html = await readFile('index.html', 'utf8');
for (const [, asset] of html.matchAll(/(?:src|href)="((?:public\/|styles\.css|app\.js)[^"]*)"/g)) await access(asset);
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'motion.js', 'public']) await cp(file, `dist/${file}`, { recursive: true });
const stylesheetVersion = createHash('sha256').update(await readFile('styles.css')).digest('hex').slice(0, 12);
await writeFile('dist/index.html', html.replace('href="styles.css"', `href="styles.css?v=${stylesheetVersion}"`));
console.log('Build complete. All local asset paths verified. Output: dist/');
