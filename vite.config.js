import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Recursively gather all .html files as entry points
function getHtmlEntries(dir, base = '') {
  const entries = {};
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'node_modules' || item.name === 'dist' || item.name === '.git') continue;
    const fullPath = resolve(dir, item.name);
    if (item.isDirectory()) {
      Object.assign(entries, getHtmlEntries(fullPath, base ? `${base}/${item.name}` : item.name));
    } else if (item.name.endsWith('.html')) {
      const name = base ? `${base}/${item.name.replace(/\.html$/, '')}` : item.name.replace(/\.html$/, '');
      entries[name] = fullPath;
    }
  }
  return entries;
}

const inputs = getHtmlEntries(__dirname);

export default defineConfig({
  build: {
    rollupOptions: {
      input: inputs
    }
  }
});
