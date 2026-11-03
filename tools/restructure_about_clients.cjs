const fs = require('fs');

const aboutMegaMenuHTML = `<li class="nav-has-dropdown">
  <a href="/about">About Us <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
  <div class="mega-menu" style="max-width: 600px; margin: 0 auto; left: 0;">
    <div class="mega-menu-inner wrap" style="grid-template-columns: 1fr 1fr; padding: 0 32px;">
      <div class="mega-col">
        <h4>About Czar</h4>
        <a href="/about">Company Overview</a>
        <a href="/team">Leadership & Team</a>
        <a href="/careers">Careers</a>
      </div>
      <div class="mega-col">
        <h4>Our Impact</h4>
        <a href="/client-results.html">Client Results</a>
        <a href="/about" style="color: var(--red); font-weight: 700; margin-top: 16px;">View Full Profile →</a>
      </div>
    </div>
  </div>
</li>`;

const sidebarAboutHTML = `
  <div id="ds-about" class="ds-menu-view">
    <div class="ds-back" onclick="switchDsView('ds-main')">◀ Main Menu</div>
    <h2 class="ds-title">About Us</h2>
    <a href="/about" class="ds-sub-link">Company Overview</a>
    <a href="/team" class="ds-sub-link">Leadership & Team</a>
    <a href="/careers" class="ds-sub-link">Careers</a>
    <div class="ds-divider"></div>
    <a href="/client-results.html" class="ds-sub-link" style="color:var(--red);">Client Results</a>
  </div>
`;

function processFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && !['node_modules', '.git', 'dist'].includes(file.name)) {
      processFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;

      // 1. Top Nav: Replace About Us link and remove Client Results
      if (content.includes('<li><a href="/about">About Us</a></li>')) {
        content = content.replace('<li><a href="/about">About Us</a></li>', aboutMegaMenuHTML);
        updated = true;
      }
      if (content.includes('<li><a href="/about#client-results">Client Results</a></li>')) {
        content = content.replace(/\s*<li><a href="\/about#client-results">Client Results<\/a><\/li>/, '');
        updated = true;
      }

      // 2. Sidebar: Replace About Us with dropdown trigger
      if (content.includes('<a href="/about" class="ds-link">About Us</a>')) {
        content = content.replace('<a href="/about" class="ds-link">About Us</a>', `<div class="ds-link" onclick="switchDsView('ds-about')">About Us <span style="color:var(--red);">→</span></div>`);
        updated = true;
      }
      if (content.includes('<a href="/about#client-results" class="ds-link">Client Results</a>')) {
        content = content.replace(/\s*<a href="\/about#client-results" class="ds-link">Client Results<\/a>/, '');
        updated = true;
      }
      
      // 3. Sidebar: Inject ds-about view
      if (content.includes('<div id="ds-services"') && !content.includes('id="ds-about"')) {
        content = content.replace('<div id="ds-services"', sidebarAboutHTML + '\n  <div id="ds-services"');
        updated = true;
      }
      
      // 4. Also context aware JS update
      if (content.includes("switchDsView('ds-insights');") && !content.includes("switchDsView('ds-about')")) {
        content = content.replace("else if (path.includes('/article') || path.includes('/insight')) {", "else if (path.includes('/about') || path.includes('/team')) {\n    switchDsView('ds-about');\n  } else if (path.includes('/article') || path.includes('/insight')) {");
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated Nav in ' + fullPath);
      }
    }
  }
}

processFiles('.');

// Now handle about.html grid extraction
let aboutHTML = fs.readFileSync('about.html', 'utf8');
const gridRegex = /<section class="client-results-sec" id="client-results">[\s\S]*?<\/section>/;

if (gridRegex.test(aboutHTML)) {
  const fullGrid = aboutHTML.match(gridRegex)[0];
  
  // Create client-results.html using about.html as a template
  let clientResultsHTML = aboutHTML;
  // Replace <main>...</main> with just the grid
  const mainRegex = /<main>[\s\S]*?<\/main>/;
  clientResultsHTML = clientResultsHTML.replace(mainRegex, '<main style="padding-top:80px;">\n' + fullGrid + '\n</main>');
  // Update title
  clientResultsHTML = clientResultsHTML.replace(/<title>.*?<\/title>/, '<title>Client Results | Czar Consultancy</title>');
  
  fs.writeFileSync('client-results.html', clientResultsHTML);
  console.log('Created client-results.html');
  
  const calloutHTML = `
<section class="client-results-callout" style="padding: 80px 0; background: #fff; border-top: 1px solid var(--line);">
  <div class="wrap" style="text-align: center;">
    <h2 style="font-family: var(--ff-serif); font-size: 36px; color: var(--ink); margin-bottom: 24px;">Our Client Impact</h2>
    <p style="color: var(--gray); font-size: 18px; max-width: 600px; margin: 0 auto 32px;">Discover how we help industry leaders achieve seamless compliance and operational excellence.</p>
    <a href="/client-results.html" class="nav-cta" style="display: inline-block; font-size: 16px; padding: 14px 32px;">View Client Results</a>
  </div>
</section>
`;
  aboutHTML = aboutHTML.replace(gridRegex, calloutHTML);
  fs.writeFileSync('about.html', aboutHTML);
  console.log('Replaced grid in about.html with callout.');
}
