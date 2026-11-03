const fs = require('fs');
const path = require('path');

function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      processHtmlFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // 1. Add max-width: 85vw to #desktop-sidebar
      if (content.includes('width: 390px;') && !content.includes('max-width: 85vw;')) {
        content = content.replace('width: 390px;', 'width: 390px;\n  max-width: 85vw;');
        modified = true;
      }
      
      // 2. Remove the old mobileNav HTML completely
      const mobNavRegex = /<div class="mob-nav" id="mobileNav"[^>]*>.*?<\/div>/s;
      if (mobNavRegex.test(content)) {
        content = content.replace(mobNavRegex, '');
        modified = true;
      }

      // 3. Update toggleMobileNav function
      const oldToggleFuncRegex = /function\s+toggleMobileNav\s*\(\)\s*\{[^}]*?document\.body\.style\.overflow[^}]*\}/;
      const newToggleFunc = `function toggleMobileNav(){
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn && mobBtn.classList.contains('open')) {
    closeDesktopSidebar();
  } else {
    openDesktopSidebar();
  }
}`;
      if (oldToggleFuncRegex.test(content)) {
        content = content.replace(oldToggleFuncRegex, newToggleFunc);
        modified = true;
      }

      // 4. Update openDesktopSidebar to toggle hamburger
      if (content.includes('sidebar.classList.add(\'open\');') && !content.includes('mobBtn.classList.add(\'open\');')) {
        content = content.replace('sidebar.classList.add(\'open\');', `sidebar.classList.add('open');
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn) mobBtn.classList.add('open');
  document.body.style.overflow = 'hidden';`);
        modified = true;
      }

      // 5. Update closeDesktopSidebar to untoggle hamburger
      if (content.includes('function closeDesktopSidebar() {') && !content.includes('mobBtn.classList.remove(\'open\');')) {
        content = content.replace(/function closeDesktopSidebar\(\) \{[\s\S]*?\}/, `function closeDesktopSidebar() {
  document.getElementById('desktop-sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn) mobBtn.classList.remove('open');
  document.body.style.overflow = '';
}`);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Applied drill-down nav to:', fullPath);
      }
    }
  }
}

processHtmlFiles('.');
