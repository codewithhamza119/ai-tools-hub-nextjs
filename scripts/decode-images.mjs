// Decodes *.b64 text files under public/ back into their real binary images.
// Needed because the GitHub file API used for pushes expects raw text content,
// so binary images are stored in the repo as base64 text with a .b64 suffix.
// Runs automatically via the `prebuild` npm script on Vercel (and locally).
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (p.endsWith('.b64')) out.push(p);
  }
  return out;
}

let n = 0;
for (const b64path of walk(root)) {
  const target = b64path.slice(0, -4); // strip .b64
  const buf = Buffer.from(readFileSync(b64path, 'utf8').trim(), 'base64');
  writeFileSync(target, buf);
  n++;
}
console.log(`[decode-images] decoded ${n} image(s)`);
