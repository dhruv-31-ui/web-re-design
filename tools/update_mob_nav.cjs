const fs = require('fs');

function updateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
      updateFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex1 = /\.mob-nav\s*\{[\s\S]*?\.mob-nav-close\s*\{[^\}]*\}/g;
      const regex2 = /\.mob-nav\s*\{[\s\S]*?\.mob-nav-close\s*.*?display:\s*none;?\s*\}/g;
      
      const replacement = `.mob-nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 10px 0 40px rgba(0,0,0,0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 80px 32px 32px;
  gap: 16px;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0;
  opacity: 1;
  visibility: visible;
}
.mob-nav.open {
  transform: translateX(0);
}
.mob-nav a { font-size: 18px; font-weight: 600; padding: 8px 0; color: var(--ink); transition: color 0.3s; }
.mob-nav a:hover { color: var(--red); }
.mob-nav .nav-cta { display: inline-block; margin-top: 12px; padding: 12px 24px; border-radius: 6px; margin-left: 0; }
.mob-nav-close { display: block; position: absolute; top: 20px; right: 20px; font-size: 28px; font-weight: 300; color: var(--gray); padding: 8px; cursor: pointer; background: none; border: none; line-height: 1; }`;

      let updated = false;
      if (regex2.test(content)) {
        content = content.replace(regex2, replacement);
        updated = true;
      } else if (regex1.test(content)) {
        content = content.replace(regex1, replacement);
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      } else {
        console.log('Skipped ' + fullPath);
      }
    }
  }
}

updateFiles('.');
