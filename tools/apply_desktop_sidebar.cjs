const fs = require('fs');

const sidebarCSS = `
/* DESKTOP SMART SIDEBAR */
.desktop-hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  cursor: pointer;
  background: none;
  border: none;
  margin-right: 20px;
}
.desktop-hamburger span {
  width: 24px;
  height: 2px;
  background: var(--ink);
  transition: all 0.3s;
  border-radius: 2px;
}
.desktop-hamburger:hover span { background: var(--red); }
@media (max-width: 900px) {
  .desktop-hamburger { display: none; }
}

#desktop-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 390px;
  max-width: 85vw;
  height: 100vh;
  background: #fff;
  z-index: 10000;
  transform: translateX(-100%);
  transition: transform 0.4s var(--ease);
  box-shadow: 10px 0 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
#desktop-sidebar.open {
  transform: translateX(0);
}
#sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
#sidebar-overlay.open {
  opacity: 1;
  visibility: visible;
}
.ds-header {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
}
.ds-close {
  font-size: 28px;
  font-weight: 300;
  color: var(--gray);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.ds-close:hover { color: var(--red); }
.ds-menu-view {
  display: none;
  padding: 32px;
  flex-direction: column;
  gap: 16px;
}
.ds-menu-view.active {
  display: flex;
}
.ds-back {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray);
  cursor: pointer;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ds-back:hover { color: var(--red); }
.ds-title {
  font-family: var(--ff-serif);
  font-size: 28px;
  color: var(--ink);
  margin-bottom: 16px;
}
.ds-link {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  transition: color 0.2s;
  cursor: pointer;
}
.ds-link:hover { color: var(--red); }
.ds-sub-link {
  font-size: 15px;
  color: var(--ink);
  padding: 8px 0;
  transition: color 0.2s;
}
.ds-sub-link:hover { color: var(--red); }
.ds-divider {
  height: 1px;
  background: var(--line);
  margin: 16px 0;
}
.ds-category {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray);
  margin-top: 16px;
  margin-bottom: 8px;
}
`;

const sidebarHTML = `
<!-- SMART DESKTOP SIDEBAR -->
<div id="sidebar-overlay" onclick="closeDesktopSidebar()"></div>
<div id="desktop-sidebar">
  <div class="ds-header">
    <img src="/logo.png" alt="Czar Consultancy" style="height: 32px;">
    <button class="ds-close" onclick="closeDesktopSidebar()">×</button>
  </div>
  
  <div id="ds-main" class="ds-menu-view">
    <a href="/" class="ds-link">Home</a>
    <a href="/about" class="ds-link">About Us</a>
    <div class="ds-link" onclick="switchDsView('ds-services')">Services <span style="color:var(--red);">→</span></div>
    <div class="ds-link" onclick="switchDsView('ds-insights')">Insights <span style="color:var(--red);">→</span></div>
    <a href="/careers" class="ds-link">Careers</a>
    <a href="/contact" class="ds-link">Contact</a>
  </div>

  <div id="ds-services" class="ds-menu-view">
    <div class="ds-back" onclick="switchDsView('ds-main')">◀ Main Menu</div>
    <h2 class="ds-title">Services</h2>
    
    <div class="ds-category">Core Compliance</div>
    <a href="/services/shop" class="ds-sub-link">Shops & Establishments</a>
    <a href="/services/factory" class="ds-sub-link">Factories Act Compliance</a>
    <a href="/services/contract" class="ds-sub-link">Contract Labour (CLRA)</a>
    <a href="/services/bocw" class="ds-sub-link">BOCW Act</a>
    
    <div class="ds-category">Payroll & Social Security</div>
    <a href="/services/payroll" class="ds-sub-link">Payroll Processing</a>
    <a href="/services/pfesic" class="ds-sub-link">PF & ESIC Compliance</a>
    <a href="/services/epf" class="ds-sub-link">EPF Trust Management</a>

    <div class="ds-category">Advisory & Audits</div>
    <a href="/services/labour" class="ds-sub-link">Labour Laws Advisory</a>
    <a href="/services/posh" class="ds-sub-link">POSH Act Compliance</a>
    <a href="/services/fire" class="ds-sub-link">Fire NOC & Lifts</a>
    <a href="/services/registration" class="ds-sub-link">Licenses & Registrations</a>
    <a href="/services/recruitment" class="ds-sub-link">Recruitment</a>
  </div>

  <div id="ds-insights" class="ds-menu-view">
    <div class="ds-back" onclick="switchDsView('ds-main')">◀ Main Menu</div>
    <h2 class="ds-title">Insights</h2>
    <a href="/article-pf" class="ds-sub-link">Understanding PF & ESIC</a>
    <a href="/article-posh" class="ds-sub-link">POSH Act Guidelines</a>
    <a href="/article-gratuity" class="ds-sub-link">Gratuity Rules</a>
    <a href="/article-wage" class="ds-sub-link">Minimum Wages Act</a>
    <a href="/article-factory" class="ds-sub-link">Factories Act Deep Dive</a>
    <a href="/article-digital" class="ds-sub-link">Digital Compliance</a>
    <a href="/article-shift" class="ds-sub-link">Shift Operations</a>
    <a href="/article-inspection" class="ds-sub-link">Preparing for Inspections</a>
    <a href="/article-contract" class="ds-sub-link">Contract Labour Regulations</a>
    <a href="/insights" class="ds-link" style="color:var(--red); font-size:15px; margin-top:20px;">View All Insights →</a>
  </div>
</div>

<script>
function openDesktopSidebar() {
  const sidebar = document.getElementById('desktop-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  // Context-aware logic
  const path = window.location.pathname;
  if (path.includes('/services')) {
    switchDsView('ds-services');
  } else if (path.includes('/article') || path.includes('/insight')) {
    switchDsView('ds-insights');
  } else {
    switchDsView('ds-main');
  }
  
  sidebar.classList.add('open');
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn) mobBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.classList.add('open');
}

function closeDesktopSidebar() {
  document.getElementById('desktop-sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  const mobBtn = document.querySelector('.hamburger');
  if(mobBtn) mobBtn.classList.remove('open');
  document.body.style.overflow = '';
}

function switchDsView(viewId) {
  document.querySelectorAll('.ds-menu-view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}
</script>
`;

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
      
      // 1. Inject CSS
      if (!content.includes('/* DESKTOP SMART SIDEBAR */') && content.includes('</style>')) {
        content = content.replace('</style>', sidebarCSS + '\n</style>');
        updated = true;
      }
      
      // 2. Inject Hamburger Icon before logo
      const logoMatch = /<a class="nav-logo"/;
      if (logoMatch.test(content) && !content.includes('desktop-hamburger')) {
        content = content.replace('<a class="nav-logo"', hamburgerBtn + '\\n        <a class="nav-logo"');
        updated = true;
      }
      
      // 3. Inject Sidebar HTML at bottom of body
      if (!content.includes('id="desktop-sidebar"') && content.includes('</body>')) {
        content = content.replace('</body>', sidebarHTML + '\\n</body>');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

updateFiles('.');
