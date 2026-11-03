const fs = require('fs');

const replacementStr = `function openDesktopSidebar() {
  const btn = document.querySelector('.desktop-hamburger');
  if(btn) {
    btn.style.transition = 'none';
    btn.style.transform = 'rotate(0deg)';
    void btn.offsetWidth;
    btn.style.transition = 'transform 0.6s ease-out';
    btn.style.transform = 'rotate(360deg)';
  }
`;

function updateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist') {
      updateFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('function openDesktopSidebar() {') && !content.includes('rotate(360deg)')) {
        content = content.replace('function openDesktopSidebar() {', replacementStr);
        fs.writeFileSync(fullPath, content);
        console.log('Added rotation to ' + fullPath);
      }
    }
  }
}

updateFiles('.');
