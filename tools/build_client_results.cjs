const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const newCSS = `
/* BAIN CLIENT RESULTS GRID */
.client-results-sec {
  padding: 100px 0;
  background: #f9fafb;
}
.client-results-header {
  margin-bottom: 64px;
  text-align: left;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 20px;
}
.client-results-header h2 {
  font-family: var(--ff-serif);
  font-size: 40px;
  color: var(--ink);
  margin-bottom: 8px;
}
.client-results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
@media (max-width: 1024px) { .client-results-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .client-results-grid { grid-template-columns: 1fr; } }

.impact-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--line);
  transition: box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;
  text-decoration: none;
}
.impact-card:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  transform: translateY(-4px);
}
.impact-card-visual {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-bottom: 1px solid var(--line);
  padding: 40px;
  overflow: hidden;
}
.impact-card-visual img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.6s, opacity 0.6s;
}
.impact-card:hover .impact-card-visual img {
  transform: scale(1.08);
  filter: grayscale(0%);
  opacity: 1;
}
.impact-card-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  flex-grow: 1;
}
.impact-card-tag {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--red);
}
.impact-card-title {
  font-family: var(--ff-serif);
  font-size: 22px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--ink);
  margin: 0;
  transition: color 0.3s;
}
.impact-card:hover .impact-card-title {
  color: var(--red);
}
`;

const clients = [
  { img: "Client 1.png", tag: "Compliance Audit", title: "Ensured 100% statutory compliance across 50+ facilities nationwide." },
  { img: "Client 2.png", tag: "Payroll Processing", title: "Streamlined multi-state payroll operations for 1,500+ employees." },
  { img: "Client 3.png", tag: "Labor Law Advisory", title: "Mitigated legal risks and resolved complex industrial disputes." },
  { img: "Client 4.png", tag: "POSH Act Compliance", title: "Established a robust framework for workplace safety and training." },
  { img: "Client 5.png", tag: "PF & ESIC Management", title: "Automated provident fund tracking to achieve zero penalty status." },
  { img: "Client 6.png", tag: "Factory Act Compliance", title: "Secured crucial licenses and renewals ahead of strict deadlines." },
  { img: "Client 7.png", tag: "Contract Labor (CLRA)", title: "Designed compliant vendor management processes for massive scale." },
  { img: "Client 8.png", tag: "Compliance Audit", title: "Executed a comprehensive audit uncovering hidden regulatory gaps." },
  { img: "Client 9.png", tag: "Labor Law Advisory", title: "Provided strategic counsel during a major organizational restructuring." },
  { img: "Client 10.png", tag: "Payroll Processing", title: "Reduced payroll processing time by 40% through modernized systems." },
  { img: "Client 12.png", tag: "POSH Act Compliance", title: "Trained over 5,000 employees on anti-harassment policies." },
  { img: "Client 13.png", tag: "Factory Act Compliance", title: "Ensured continuous compliance across a 24/7 manufacturing operation." },
  { img: "Client 14.png", tag: "PF & ESIC Management", title: "Resolved historic EPF discrepancies and recovered lost funds." }
];

let cardsHTML = '';
clients.forEach(c => {
  cardsHTML += `
      <a href="#" class="impact-card">
        <div class="impact-card-visual">
          <img src="/${c.img}" alt="Client">
        </div>
        <div class="impact-card-content">
          <span class="impact-card-tag">${c.tag}</span>
          <h3 class="impact-card-title">${c.title}</h3>
        </div>
      </a>`;
});

const newHTML = `
<!-- BAIN CLIENT RESULTS GRID -->
<section class="client-results-sec">
  <div class="wrap">
    <div class="client-results-header">
      <h2>Client Results</h2>
      <p style="color: var(--gray); font-size: 16px; max-width: 600px;">Discover how we help industry leaders achieve seamless compliance and operational excellence.</p>
    </div>
    <div class="client-results-grid">
      ${cardsHTML}
    </div>
  </div>
</section>
`;

// Inject CSS
if (!content.includes('/* BAIN CLIENT RESULTS GRID */')) {
  content = content.replace('</style>', newCSS + '\n</style>');
}

// Replace HTML (find old client-strip section)
// Since the old HTML starts with <section class="client-strip"> and ends before <!-- SERVICES GRID -->, we can regex it.
const stripRegex = /<!-- CLIENT LOGO STRIP -->[\s\S]*?<\/section>/;
if (stripRegex.test(content)) {
  content = content.replace(stripRegex, newHTML);
}

fs.writeFileSync('index.html', content);
console.log('Successfully updated Client Results section.');
