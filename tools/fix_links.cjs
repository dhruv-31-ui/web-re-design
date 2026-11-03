const fs = require('fs');
const path = require('path');
function fix(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist', 'public', 'tools'].includes(file.name)) {
      fix(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('href="/client-results.html"')) {
        content = content.replace(/href="\/client-results\.html"/g, 'href="/client-results"');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed links in:', fullPath);
      }
    }
  }
}
fix('.');
