const fs = require('fs');

// 1. Restore old client strip to index.html and remove the giant grid
let indexHTML = fs.readFileSync('index.html', 'utf8');

const oldClientStrip = `
<!-- CLIENT LOGO STRIP -->
<section class="client-strip">
  <div class="wrap client-strip-inner">
    <div class="client-strip-header">
      <h2 class="client-strip-title">Trusted by Industry Leaders</h2>
      <p class="client-strip-subtitle">Serving over 200 organizations across manufacturing, technology, hospitality, banking, and professional services sectors.</p>
    </div>
    <div class="client-logos">
      <div class="client-logo-item"><span class="client-logo-text">Manufacturing</span><span class="client-logo-desc">Industrial Giants</span></div>
      <div class="client-logo-item"><span class="client-logo-text">TechCorp</span><span class="client-logo-desc">Technology</span></div>
      <div class="client-logo-item"><span class="client-logo-text">Hospitality</span><span class="client-logo-desc">Hotel Chains</span></div>
      <div class="client-logo-item"><span class="client-logo-text">BANKING</span><span class="client-logo-desc">Financial Services</span></div>
      <div class="client-logo-item"><span class="client-logo-text">Retail</span><span class="client-logo-desc">Commerce</span></div>
      <div class="client-logo-item"><span class="client-logo-text">Healthcare</span><span class="client-logo-desc">Medical Providers</span></div>
    </div>
  </div>
</section>
`;

const gridRegex = /<!-- BAIN CLIENT RESULTS GRID -->[\s\S]*?<\/section>/;
let extractedGrid = '';

if (gridRegex.test(indexHTML)) {
  extractedGrid = indexHTML.match(gridRegex)[0];
  // Replace it back with the old strip
  indexHTML = indexHTML.replace(gridRegex, oldClientStrip);
  fs.writeFileSync('index.html', indexHTML);
  console.log('Restored index.html');
} else {
  console.log('Grid not found in index.html, maybe already removed.');
}

// 2. Inject into about.html
if (extractedGrid) {
  let aboutHTML = fs.readFileSync('about.html', 'utf8');
  
  // Add ID for anchor linking
  extractedGrid = extractedGrid.replace('<section class="client-results-sec">', '<section class="client-results-sec" id="client-results">');
  
  // Inject before the footer or before the contact banner
  const injectTarget = /(<section class="banner")|(<\/main>)/;
  
  if (!aboutHTML.includes('id="client-results"')) {
    aboutHTML = aboutHTML.replace(injectTarget, extractedGrid + '\n  $1');
  }
  
  // Ensure CSS is present in about.html (it should be since it shares the same stylesheet block pattern)
  // Actually, wait, the CSS was injected into index.html inline! Let me extract it from index.html or just redefine it.
  const cssRegex = /\/\* BAIN CLIENT RESULTS GRID \*\/[\s\S]*?(?=<\/style>)/;
  const matchCSS = indexHTML.match(cssRegex);
  if (matchCSS && !aboutHTML.includes('/* BAIN CLIENT RESULTS GRID */')) {
    aboutHTML = aboutHTML.replace('</style>', matchCSS[0] + '\n</style>');
  }
  
  fs.writeFileSync('about.html', aboutHTML);
  console.log('Updated about.html with Client Results Grid.');
}

// 3. Update global navigation scripts to add "Client Results"
function updateNavInFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist') {
      updateNavInFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      
      // Top Navigation
      if (content.includes('>Insights <svg') && !content.includes('Client Results</a></li>')) {
        content = content.replace(/(<li class="nav-has-dropdown">\s*<a href="\/insights">Insights[\s\S]*?<\/li>)/, '$1\n          <li><a href="/about#client-results">Client Results</a></li>');
        updated = true;
      }
      
      // Sidebar Main Menu
      if (content.includes('onclick="switchDsView(\\\'ds-insights\\\')"') && !content.includes('>Client Results</a>')) {
        content = content.replace(/(<div class="ds-link" onclick="switchDsView\('ds-insights'\)">Insights <span style="color:var\(--red\);">→<\/span><\/div>)/, '$1\n    <a href="/about#client-results" class="ds-link">Client Results</a>');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated nav in ' + fullPath);
      }
    }
  }
}

updateNavInFiles('.');
