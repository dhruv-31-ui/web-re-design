const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/karan/OneDrive/Documents/web-re-design';
const articleTemplate = fs.readFileSync(path.join(dir, 'article.html'), 'utf8');
let insightsPage = fs.readFileSync(path.join(dir, 'insights.html'), 'utf8');

const articles = [
  {
    id: 'epfo',
    title: 'EPFO New Guidelines on Joint Declarations',
    tag: 'Payroll',
    date: 'Oct 10, 2024',
    content: '<p>Recent circulars from the EPFO mandate strict adherence to joint declaration forms for modifying member profiles. The process requires employers to maintain detailed documentation of any corrections made to employee records.</p><p>Employers should ensure that all KYC details match exactly with Aadhaar records to prevent claim rejections. A joint declaration must be signed by both the employee and the authorized signatory of the establishment.</p><h2>Key Steps for Compliance</h2><ul><li>Verify UAN and Aadhaar linkage.</li><li>Collect supporting documents (Pan, Aadhaar, Passport).</li><li>Submit physical/digital copies to the regional PF office.</li></ul><p>Failure to comply may result in delayed settlements and potential notices from the department.</p>'
  },
  {
    id: 'factory',
    title: 'Navigating Factory License Renewals in Haryana',
    tag: 'Factory Act',
    date: 'Oct 05, 2024',
    content: '<p>Haryana\'s Labour Department has updated the online portal for factory license renewals. The transition to a fully digital system aims to increase transparency and reduce processing time.</p><h2>Documentation Required</h2><p>Before applying for renewal, ensure you have the following:</p><ul><li>Approved factory building plan</li><li>Stability certificate from a competent person</li><li>NOC from the Fire Department</li><li>NOC from the Pollution Control Board</li></ul><p>It is recommended to initiate the renewal process at least 60 days prior to the expiration of the current license to avoid late fees and penalties.</p>'
  },
  {
    id: 'shift',
    title: 'Shift Compliances for 24/7 Software Operations',
    tag: 'IT/ITES',
    date: 'Sep 28, 2024',
    content: '<p>Operating a BPO or ITES company requires strict adherence to state Shops and Establishments (S&E) rules, especially concerning night shifts and women\'s safety.</p><h2>Mandatory Requirements</h2><ul><li>Door-to-door transport for women employees working past 8 PM.</li><li>Adequate security at the workplace.</li><li>Functional creche facilities for establishments with 50+ employees.</li><li>Proper rest rooms and cafeterias.</li></ul><p>Employers must also ensure that employees get mandatory compensatory offs if they work on national or state holidays.</p>'
  },
  {
    id: 'fire',
    title: 'The Ultimate Checklist for Fire Safety NOC Renewals in 2024',
    tag: 'Fire & Safety',
    date: 'Oct 12, 2024',
    content: '<p>Ensuring your commercial premises meet the latest National Building Code requirements is critical before the fire inspector arrives. A valid Fire NOC is a prerequisite for renewing other operational licenses.</p><h2>Preparation Checklist</h2><ul><li>Ensure all fire extinguishers are serviced and within their expiry date.</li><li>Test fire alarms, smoke detectors, and sprinkler systems monthly.</li><li>Maintain clear, unblocked emergency exit routes.</li><li>Conduct quarterly fire drills and maintain a register.</li></ul><p>Non-compliance can lead to immediate sealing of premises and criminal liability for the occupiers.</p>'
  },
  {
    id: 'posh',
    title: 'Decoding the POSH Act: Setting up an IC',
    tag: 'POSH',
    date: 'Sep 20, 2024',
    content: '<p>The Prevention of Sexual Harassment (POSH) Act mandates every organisation with 10 or more employees to constitute an Internal Committee (IC). This is a non-negotiable compliance requirement.</p><h2>Structure of the IC</h2><ul><li><strong>Presiding Officer:</strong> Must be a senior level female employee.</li><li><strong>Internal Members:</strong> At least two employees committed to the cause of women.</li><li><strong>External Member:</strong> A person from an NGO or an expert in the field.</li></ul><p>Furthermore, at least one-half of the total members must be women. Employers must also file an annual return documenting the number of cases filed and resolved.</p>'
  },
  {
    id: 'contract',
    title: 'Contract Labour Compliance 101',
    tag: 'Labour Laws',
    date: 'Sep 10, 2024',
    content: '<p>Understanding principal employer liabilities when dealing with third-party vendors and contract workers is essential to avoid unexpected financial and legal burdens.</p><h2>Principal Employer Responsibilities</h2><p>Even though contractors directly employ the workers, the principal employer is ultimately responsible for:</p><ul><li>Ensuring minimum wages are paid on time (must be present during disbursement).</li><li>Providing basic amenities like canteens, rest rooms, and first aid.</li><li>Ensuring EPF and ESIC contributions are deposited by the contractor.</li></ul><p>Engaging unlicensed contractors can result in the contract workers being deemed direct employees of the principal employer by labour courts.</p>'
  },
  {
    id: 'wage',
    title: 'State-wise Minimum Wage Revisions',
    tag: 'Payroll',
    date: 'Oct 01, 2024',
    content: '<p>A complete overview of the Variable Dearness Allowance (VDA) changes across major Indian states for Q4. Minimum wages undergo revision twice a year (typically April and October) in most states.</p><h2>Impact on Payroll</h2><p>Employers must proactively track these changes to ensure their base salaries do not fall below the statutory minimums. A failure to update payroll software can result in underpayment claims.</p><ul><li>Delhi: VDA increased by INR 450 per month across all categories.</li><li>Karnataka: New basic rates announced for engineering industries.</li><li>Maharashtra: Special allowance updated for commercial establishments.</li></ul><p>Always calculate PF, ESIC, and Overtime based on these revised minimum wages.</p>'
  }
];

// Helper to replace content in the template
function generateHTML(article) {
  let html = articleTemplate;
  
  // Replace Title
  html = html.replace(
    /<h1 class="article-title">.*?<\/h1>/s,
    `<h1 class="article-title">${article.title}</h1>`
  );
  
  // Replace Subtitle
  html = html.replace(
    /<p class="article-subtitle">.*?<\/p>/s,
    `<p class="article-subtitle">Expert insights and compliance guidelines regarding ${article.title.toLowerCase()}.</p>`
  );
  
  // Replace Meta (Tag & Date)
  html = html.replace(
    /<span class="hero-tag">.*?<\/span>/,
    `<span class="hero-tag">${article.tag}</span>`
  );
  html = html.replace(
    /<span>July 2026<\/span>/,
    `<span>${article.date}</span>`
  );
  
  // Replace Article Body (everything between <div class="article-content"> and <div class="share-bar">)
  const bodyRegex = /(<div class="article-content">).*?(<div class="share-bar">)/s;
  html = html.replace(bodyRegex, `$1\n      ${article.content}\n\n      $2`);
  
  return html;
}

// Write the files and update insights.html links
articles.forEach(article => {
  const filename = `article-${article.id}.html`;
  fs.writeFileSync(path.join(dir, filename), generateHTML(article));
  
  // Update links in insights.html
  // E.g. find the specific article title in insights.html and change its parent anchor's href
  // Since the titles are exact, we can use a regex to find the block
  // A simpler way: we know the titles match.
  // We can just globally replace the hrefs for these specific blocks.
  
  // For trending cards:
  const trendingRegex = new RegExp(`<a href="/article"( class="trend-card"[^>]*>[\\s\\S]*?<h3>${article.title.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}</h3>)`, 'g');
  insightsPage = insightsPage.replace(trendingRegex, `<a href="/${filename}"$1`);
  
  // For latest cards:
  // The structure is an article tag with an inner anchor. Wait, in latest articles, the link is <a href="/article" class="art-read">Read Guide</a>
  // So we need to match the block containing the title, and change the href inside it.
  const latestBlockRegex = new RegExp(`(<article class="art-card">[\\s\\S]*?<h3>${article.title.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}<\/h3>[\\s\\S]*?<a href=")/article(" class="art-read">)`, 'g');
  insightsPage = insightsPage.replace(latestBlockRegex, `$1/${filename}$2`);
  
  // Same for timeline govt updates (if any matched)
  const timelineRegex = new RegExp(`(<h3>${article.title.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}<\/h3>[\\s\\S]*?<a href=")/article(" class="tl-link">)`, 'g');
  insightsPage = insightsPage.replace(timelineRegex, `$1/${filename}$2`);
});

fs.writeFileSync(path.join(dir, 'insights.html'), insightsPage);
console.log('Successfully generated 7 new articles and updated links in insights.html!');
