const fs = require('fs');
const path = require('path');

const mobNavHtml = `
<div class="mob-nav" id="mobileNav" aria-hidden="true">
  <button class="mob-nav-close" type="button" onclick="toggleMobileNav()">✕</button>
  <a href="/">Home</a><a href="/about">About Us</a><a href="/services">Services</a>
  <a href="/insights">Insights</a><a href="/team">Our Team</a><a href="/careers">Careers</a>
  <a href="/contact">Contact</a>
</div>
`;

function injectMobNav(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      injectMobNav(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (!content.includes('id="mobileNav"')) {
        // Inject after </header>
        const headerEnd = '</header>';
        const insertIndex = content.indexOf(headerEnd);
        if (insertIndex !== -1) {
          content = content.slice(0, insertIndex + headerEnd.length) + '\n' + mobNavHtml + content.slice(insertIndex + headerEnd.length);
          fs.writeFileSync(fullPath, content);
          console.log('Injected mob-nav into:', fullPath);
        }
      }
    }
  }
}

injectMobNav('.');
