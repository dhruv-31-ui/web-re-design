const fs = require('fs');

const hamburgerBtn = `<button class="desktop-hamburger" onclick="openDesktopSidebar()" aria-label="Menu"><span></span><span></span><span></span></button>`;

function updateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist') {
      updateFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      
      // 1. Inject Hamburger Icon before logo (if missing)
      const logoMatch = /<a class="nav-logo"/;
      if (logoMatch.test(content) && !content.includes('class="desktop-hamburger"')) {
        content = content.replace('<a class="nav-logo"', hamburgerBtn + '\n        <a class="nav-logo"');
        updated = true;
      }
      
      // 2. Fix Insights Mega Menu layout
      if (content.includes('style="left: auto; right: -200px; width: 600px;"')) {
        content = content.replace('style="left: auto; right: -200px; width: 600px;"', '');
        content = content.replace('style="grid-template-columns: 1fr 1fr; padding: 0 32px;"', 'style="grid-template-columns: 1fr 1fr; max-width: 800px; margin: 0 auto;"');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

updateFiles('.');
