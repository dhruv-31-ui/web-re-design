const fs = require('fs');

const megaMenuCSS = `
/* MEGA MENU */
.nav-has-dropdown { position: static; }
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  padding: 48px 0;
  z-index: 999;
}
.nav-has-dropdown:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.mega-menu-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.mega-col h4 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray);
  margin-bottom: 20px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 12px;
}
.mega-col a {
  display: block;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink);
  padding: 8px 0;
  transition: color 0.2s;
  text-decoration: none;
}
.mega-col a:after {
  display: none !important; /* disable the red underline from header links */
}
.mega-col a:hover {
  color: var(--red);
}
`;

const megaMenuHTML = `<li class="nav-has-dropdown">
            <a href="/services">Services <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
            <div class="mega-menu">
              <div class="mega-menu-inner wrap">
                <div class="mega-col">
                  <h4>Core Compliance</h4>
                  <a href="/services/shop">Shops & Establishments</a>
                  <a href="/services/factory">Factories Act Compliance</a>
                  <a href="/services/contract">Contract Labour (CLRA)</a>
                  <a href="/services/bocw">BOCW Act</a>
                </div>
                <div class="mega-col">
                  <h4>Payroll & Social Security</h4>
                  <a href="/services/payroll">Payroll Processing</a>
                  <a href="/services/pfesic">PF & ESIC Compliance</a>
                  <a href="/services/epf">EPF Trust Management</a>
                </div>
                <div class="mega-col">
                  <h4>Advisory & Audits</h4>
                  <a href="/services/labour">Labour Laws Advisory</a>
                  <a href="/services/posh">POSH Act Compliance</a>
                  <a href="/services/fire">Fire NOC & Lifts</a>
                  <a href="/services/registration">Licenses & Registrations</a>
                  <a href="/services/recruitment">Recruitment</a>
                </div>
              </div>
            </div>
          </li>`;

function updateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist') {
      updateFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      
      // Inject CSS
      if (!content.includes('/* MEGA MENU */') && content.includes('</style>')) {
        content = content.replace('</style>', megaMenuCSS + '\n</style>');
        updated = true;
      }
      
      // Replace HTML link
      // Match <li><a href="/services">Services</a></li> or similar
      const linkRegex = /<li>\s*<a href="\/services"[^>]*>Services<\/a>\s*<\/li>/;
      if (linkRegex.test(content) && !content.includes('class="nav-has-dropdown"')) {
        content = content.replace(linkRegex, megaMenuHTML);
        updated = true;
      }

      // If this is index.html, update the Hero section
      if (fullPath === './index.html') {
         // Replace hero slider CSS and HTML
         // Instead of complex regex, let's just write a custom script for index.html below
      }

      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

updateFiles('.');
