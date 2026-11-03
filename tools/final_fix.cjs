const fs = require('fs');
const path = require('path');

const newToggleFunc = `function toggleMobileNav(){
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn && mobBtn.classList.contains('open')) {
    closeDesktopSidebar();
  } else {
    openDesktopSidebar();
  }
}`;

function fixFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      fixFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes('getElementById(\'mobileNav\')') || content.includes('getElementById("mobileNav")')) {
        const regex = /function\s+toggleMobileNav\s*\(\)\s*\{[\s\S]*?document\.body\.style\.overflow[^}]*\}/;
        content = content.replace(regex, newToggleFunc);
        fs.writeFileSync(fullPath, content);
        console.log('Fixed toggleMobileNav safely in:', fullPath);
      }
    }
  }
}
fixFiles('.');
