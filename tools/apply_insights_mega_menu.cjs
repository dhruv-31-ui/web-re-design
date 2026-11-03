const fs = require('fs');

const insightsMegaMenuHTML = `<li class="nav-has-dropdown">
            <a href="/insights">Insights <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
            <div class="mega-menu" style="left: auto; right: -200px; width: 600px;">
              <div class="mega-menu-inner wrap" style="grid-template-columns: 1fr 1fr; padding: 0 32px;">
                <div class="mega-col">
                  <h4>Compliance Articles</h4>
                  <a href="/article-pf">Understanding PF & ESIC</a>
                  <a href="/article-posh">POSH Act Guidelines</a>
                  <a href="/article-gratuity">Gratuity Rules</a>
                  <a href="/article-wage">Minimum Wages Act</a>
                  <a href="/article-factory">Factories Act Deep Dive</a>
                </div>
                <div class="mega-col">
                  <h4>Updates & News</h4>
                  <a href="/article-digital">Digital Compliance</a>
                  <a href="/article-shift">Shift Operations</a>
                  <a href="/article-inspection">Preparing for Inspections</a>
                  <a href="/article-contract">Contract Labour Regulations</a>
                  <a href="/insights" style="color: var(--red); font-weight: 700; margin-top: 16px;">View All Insights →</a>
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
      
      // Replace HTML link
      const linkRegex = /<li>\s*<a href="\/insights"[^>]*>Insights<\/a>\s*<\/li>/;
      if (linkRegex.test(content) && !content.includes('Understanding PF & ESIC')) {
        content = content.replace(linkRegex, insightsMegaMenuHTML);
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
