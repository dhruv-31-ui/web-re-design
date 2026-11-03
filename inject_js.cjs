const fs = require('fs');
const path = require('path');

const scriptToAdd = `
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

function fixFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !['node_modules', '.git', 'dist', 'public'].includes(file.name)) {
      fixFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix literal '\n</body>' if it exists
      content = content.replace(/\\n<\/body>/g, '</body>');

      // Inject toggleMobileNav if missing
      if (!content.includes('function toggleMobileNav')) {
        content = content.replace('</body>', scriptToAdd + '\n</body>');
        fs.writeFileSync(fullPath, content);
        console.log('Injected JS into:', fullPath);
      }
    }
  }
}

fixFiles('.');
