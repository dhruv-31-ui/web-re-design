const fs = require('fs');

let indexHTML = fs.readFileSync('index.html', 'utf8');

// The grid CSS and HTML string that we want to put in client-results.html
const gridHTML = `
<!-- BAIN CLIENT RESULTS GRID -->
<section class="client-results-sec" id="client-results" style="padding: 140px 0 100px;">
  <div class="wrap">
    <div class="client-results-header">
      <h2>Client Results</h2>
      <p style="color: var(--gray); font-size: 16px; max-width: 600px;">Discover how we help industry leaders achieve seamless compliance and operational excellence.</p>
    </div>
    <div class="client-results-grid">
      
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 1.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Compliance Audit</span>
          <h3 class="impact-card-title">Ensured 100% statutory compliance across 50+ facilities nationwide.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 2.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Payroll Processing</span>
          <h3 class="impact-card-title">Streamlined multi-state payroll operations for 1,500+ employees.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 3.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Labor Law Advisory</span>
          <h3 class="impact-card-title">Mitigated legal risks and resolved complex industrial disputes.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 4.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">POSH Act Compliance</span>
          <h3 class="impact-card-title">Established a robust framework for workplace safety and training.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 5.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">PF & ESIC Management</span>
          <h3 class="impact-card-title">Automated provident fund tracking to achieve zero penalty status.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 6.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Factory Act Compliance</span>
          <h3 class="impact-card-title">Secured crucial licenses and renewals ahead of strict deadlines.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 7.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Contract Labor (CLRA)</span>
          <h3 class="impact-card-title">Designed compliant vendor management processes for massive scale.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 8.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Compliance Audit</span>
          <h3 class="impact-card-title">Executed a comprehensive audit uncovering hidden regulatory gaps.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 9.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Labor Law Advisory</span>
          <h3 class="impact-card-title">Provided strategic counsel during a major organizational restructuring.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 10.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Payroll Processing</span>
          <h3 class="impact-card-title">Reduced payroll processing time by 40% through modernized systems.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 12.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">POSH Act Compliance</span>
          <h3 class="impact-card-title">Trained over 5,000 employees on anti-harassment policies.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 13.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">Factory Act Compliance</span>
          <h3 class="impact-card-title">Ensured continuous compliance across a 24/7 manufacturing operation.</h3>
        </div>
      </a>
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/Client 14.png" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">PF & ESIC Management</span>
          <h3 class="impact-card-title">Resolved historic EPF discrepancies and recovered lost funds.</h3>
        </div>
      </a>
    </div>
  </div>
</section>
`;

// Find where header ends and footer begins in index.html
const headerEndIndex = indexHTML.indexOf('</header>') + '</header>'.length;
const footerStartIndex = indexHTML.indexOf('<!-- CTA -->');

if (headerEndIndex > -1 && footerStartIndex > -1) {
  const topPart = indexHTML.substring(0, headerEndIndex);
  // Also we want to change <title>
  const topWithTitle = topPart.replace(/<title>.*?<\/title>/, '<title>Client Results | Czar Consultancy</title>');
  
  const bottomPart = indexHTML.substring(footerStartIndex);
  
  // Combine
  let newClientResults = topWithTitle + '\n' + gridHTML + '\n' + bottomPart;
  
  fs.writeFileSync('client-results.html', newClientResults);
  console.log('Successfully rebuilt client-results.html');
} else {
  console.log('Could not find header or footer tags.');
}
