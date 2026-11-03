const fs = require('fs');
const path = require('path');
function check(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      check(fullPath);
    } else if (file.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('id="desktop-sidebar"')) {
        console.log('Missing desktop-sidebar:', fullPath);
      }
      if (!content.includes('function toggleMobileNav')) {
        console.log('Missing toggleMobileNav:', fullPath);
      }
      if (!content.includes('function openDesktopSidebar')) {
        console.log('Missing openDesktopSidebar:', fullPath);
      }
    }
  }
}
check('.');
