const fs = require('fs');
const path = require('path');

function updateHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      updateHtmlFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Robustly remove stray }); }); anywhere near the end of a script tag
      // This looks for pairs of }); that are essentially floating. Handles CRLF too.
      const strayRegex = /[ \t]*\}\);\r?\n[ \t]*\}\);\r?\n/g;
      if (strayRegex.test(content)) {
        content = content.replace(strayRegex, '\n');
        modified = true;
      }

      // Update margin-top for hero
      if (content.includes('margin-top: 65px;')) {
        content = content.replace('margin-top: 65px;', 'margin-top: 85px;');
        modified = true;
      }
      
      if (content.includes('margin-top:65px')) {
         content = content.replace('margin-top:65px', 'margin-top:85px');
         modified = true;
      }

      // 3. Add hamburger animation CSS if not present
      const hamburgerSpanRegex = /\.hamburger span\s*\{[^}]+\}/;
      if (hamburgerSpanRegex.test(content) && !content.includes('.hamburger.open span:nth-child')) {
          content = content.replace(hamburgerSpanRegex, match => match + '\n.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }\n.hamburger.open span:nth-child(2) { opacity: 0; }\n.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }\n');
          modified = true;
      }

      // 4. Update toggleMobileNav function
      // Using robust regex to handle CRLF
      const oldToggleFuncRegex = /function toggleMobileNav\(\)\{.*?document\.body\.style\.overflow = o \? 'hidden' : '';\r?\n\}/s;
      const newToggleFunc = `function toggleMobileNav(){
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('mobileMenuButton');
  if(!nav) return;
  const o = nav.classList.toggle('open');
  nav.setAttribute('aria-hidden', String(!o));
  if(btn) {
    btn.setAttribute('aria-expanded', String(o));
    btn.classList.toggle('open', o);
  }
  document.body.style.overflow = o ? 'hidden' : '';
}`;
      
      if (oldToggleFuncRegex.test(content) && !content.includes('btn.classList.toggle(\'open\', o);')) {
        content = content.replace(oldToggleFuncRegex, newToggleFunc);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed mobile UX in:', fullPath);
      }
    }
  }
}

updateHtmlFiles('.');
