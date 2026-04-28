import fs from 'fs';
import path from 'path';

// Copy all files from dist/client/ to dist/ root so Pages serves them at correct paths.
// e.g. dist/client/_astro/Base.css → dist/_astro/Base.css → /_astro/Base.css
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync('dist/client')) {
  copyDir('dist/client', 'dist');
  console.log('postbuild: copied dist/client/* to dist/');
}

// Create _worker.js shim so Cloudflare Pages routes SSR requests through the worker.
// Pages bundles this entry point following imports into dist/server/.
fs.writeFileSync('dist/_worker.js', `export { default } from './server/entry.mjs';\n`);
console.log('postbuild: created dist/_worker.js');

// Patch dist/server/wrangler.json: remove fields that wrangler Pages rejects.
// - assets.binding: "ASSETS" is reserved; Pages provides env.ASSETS automatically.
// - pages_build_output_dir, rules, images, previews, artifacts, flagship: unsupported in Pages worker config.
const wranglerPath = 'dist/server/wrangler.json';
if (fs.existsSync(wranglerPath)) {
  const config = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
  if (config.assets) delete config.assets.binding;
  for (const key of ['pages_build_output_dir', 'rules', 'images', 'previews', 'artifacts', 'flagship']) {
    delete config[key];
  }
  fs.writeFileSync(wranglerPath, JSON.stringify(config, null, 2));
  console.log('postbuild: patched dist/server/wrangler.json');
}
