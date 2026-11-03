const fs = require('fs');
const path = require('path');

const jsToInject = `
<script>
  function toggleMobileNav() {
    const mobNav = document.getElementById('mobileNav');
    const hamburger = document.getElementById('mobileMenuButton');
    if(mobNav) {
      mobNav.classList.toggle('open');
      if(hamburger) hamburger.classList.toggle('open');
    }
  }
</script>
`;

function processFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist', 'public'].includes(file.name)) {
      processFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // 1. Re-apply Gintera Header CSS
      const oldHeaderRegex = /\.header-fixed\s*\{[^}]+\}(?:.|\n|\r)*?\.nav-cta:hover\s*\{[^}]+\}/g;
      const ginteraCSS = `.header-fixed{position:fixed;top:20px;left:50%;transform:translateX(-50%);width:calc(100% - 40px);max-width:1200px;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:100px;box-shadow:0 10px 40px rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:space-between;padding:8px 24px; border:1px solid rgba(255,255,255,0.5)}
.header-top{display:flex;align-items:center;border:none;padding:0;width:auto}
.header-top .nav-wrap{justify-content:flex-start;gap:16px;width:auto;padding:0!important}
.nav-wrap{display:flex;align-items:center;padding:0!important}
.nav-logo{display:flex;align-items:center;gap:16px;transition:transform 0.3s ease;z-index:2}
.nav-logo:hover{transform:scale(1.02)}
.logo-img{height:36px;width:auto}
.logo-tagline{display:none}
.header-contact-info{display:none!important}
.nav{border:none;display:flex;align-items:center;width:auto}
.nav .nav-wrap{justify-content:flex-end;width:auto}
.nav-links{display:flex;gap:4px;position:absolute;left:50%;transform:translateX(-50%);z-index:1}
.nav-links li{height:100%}
.nav-links a{display:flex;align-items:center;padding:10px 16px;font-size:14.5px;font-weight:500;color:var(--gray);border-radius:100px;transition:all 0.3s ease}
.nav-links a:hover,.nav-links a.active{color:var(--ink);background:rgba(0,0,0,0.04)}
.nav-cta{background:#4F46E5!important;color:#fff!important;padding:12px 28px;font-size:14.5px;font-weight:600;margin-left:16px;border-radius:100px;border:none;cursor:pointer;transition:all 0.3s ease;z-index:2;white-space:nowrap}
.nav-cta:hover{background:#4338CA!important;transform:translateY(-2px);box-shadow:0 10px 20px rgba(79,70,229,0.3)}`;

      if (oldHeaderRegex.test(content) && !content.includes('.header-fixed{position:fixed;top:20px;')) {
        content = content.replace(oldHeaderRegex, ginteraCSS);
        changed = true;
      }

      // 2. Fix Mega Menu position relative to Viewport
      const megaMenuRegex = /\.mega-menu\s*\{[^}]+\}/;
      if (megaMenuRegex.test(content) && !content.includes('top: 90px !important')) {
        content = content.replace(megaMenuRegex, `.mega-menu {
  position: fixed !important;
  top: 90px !important;
  left: 50% !important;
  width: calc(100% - 40px) !important;
  max-width: 1200px !important;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(10px) !important;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  padding: 48px 0;
  z-index: 999;
  margin: 0 !important;
}`);
        const hoverRegex = /\.nav-has-dropdown:hover\s*\.mega-menu\s*\{[^}]+\}/;
        if (hoverRegex.test(content)) {
          content = content.replace(hoverRegex, `.nav-has-dropdown:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) !important;
}`);
        }
        changed = true;
      }

      // 3. Fix Mobile Responsive CSS (top: 12px, border-radius: 50px)
      if (content.includes('@media(max-width:720px){') && !content.includes('.header-fixed { top: 12px;')) {
        content = content.replace('@media(max-width:720px){', 
          '@media(max-width:720px){\n  .header-fixed { top: 12px; width: calc(100% - 24px); padding: 8px 16px; border-radius: 50px; }\n  .logo-img { height: 32px; }');
        changed = true;
      }

      // 4. Hero Div overlaps! Add margin-top to .page-hero and .hero-slider-section
      if (content.includes('.page-hero { padding: 160px') && !content.includes('padding: 180px')) {
          content = content.replace('.page-hero { padding: 160px', '.page-hero { padding: 180px');
          changed = true;
      }
      if (content.includes('.hero-slider-section {') && !content.includes('margin-top: 108px')) {
         const heroRegex = /\.hero-slider-section\s*\{[^}]+\}/;
         if (heroRegex.test(content)) {
             content = content.replace(heroRegex, `.hero-slider-section {
  position: relative;
  height: 85vh;
  min-height: 600px;
  width: 100%;
  overflow: hidden;
  margin-top: 108px;
  background: var(--ink);
}`);
             changed = true;
         }
      }

      // 5. Add toggleMobileNav() to pages that are missing it
      if (content.includes('<button class="hamburger"') && !content.includes('function toggleMobileNav')) {
         if (content.includes('</body>')) {
             content = content.replace('</body>', jsToInject + '\n</body>');
             changed = true;
         }
      }

      // 6. Ensure Hamburger has onClick correctly assigned
      if (content.includes('<button class="hamburger" id="mobileMenuButton">')) {
         content = content.replace('<button class="hamburger" id="mobileMenuButton">', '<button class="hamburger" id="mobileMenuButton" aria-label="Toggle menu" onclick="toggleMobileNav()">');
         changed = true;
      }

      // 7. Ensure mobileNav has the correct ID so toggleMobileNav can find it
      if (content.includes('<div class="mob-nav">')) {
         content = content.replace('<div class="mob-nav">', '<div class="mob-nav" id="mobileNav">');
         changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Restored UI features in:', fullPath);
      }
    }
  }
}

processFiles('.');
