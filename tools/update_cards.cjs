const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/karan/OneDrive/Documents/web-re-design';
const articleTemplate = fs.readFileSync(path.join(dir, 'article.html'), 'utf8');

const newArticles = [
  {
    id: 'shops',
    title: 'Understanding the Shops & Establishments Act Across States',
    tag: 'REGULATORY',
    time: '4 MIN READ',
    date: 'Oct 20, 2024',
    desc: 'The Shops & Establishments Act varies significantly from state to state. This comparative analysis covers registration requirements, working hours, leave entitlements, and closure rules across major Indian states to help multi-location businesses stay compliant everywhere they operate.',
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'grievance',
    title: 'Building an Effective Grievance Redressal Mechanism',
    tag: 'HR PRACTICES',
    time: '5 MIN READ',
    date: 'Oct 18, 2024',
    desc: 'A robust internal grievance mechanism is not just a compliance requirement — it\'s a retention tool. Learn how to design, implement, and monitor a grievance redressal system that meets legal requirements under the Industrial Disputes Act while fostering trust and transparency in your organization.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'digital',
    title: 'Digital Compliance: Moving Beyond Paper-Based Record Keeping',
    tag: 'DIGITAL',
    time: '6 MIN READ',
    date: 'Oct 15, 2024',
    desc: 'The shift to digital compliance is accelerating with government portals mandating online filings. Discover how to transition your compliance workflows from paper registers to digital systems, the legal validity of electronic records, and which states now accept digital maintenance of statutory registers.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'pf',
    title: 'PF & ESIC Compliance: Avoiding the Most Common Pitfalls',
    tag: 'PAYROLL',
    time: '5 MIN READ',
    date: 'Oct 10, 2024',
    desc: 'Our audit experience reveals recurring errors in PF and ESIC filings across organizations. From incorrect wage calculations to missed deadlines and wrong contribution rates — learn the top 10 mistakes employers make and how to avoid penalties that can run into lakhs.',
    img: 'https://images.unsplash.com/photo-1554224154-26032ffc0dff?auto=format&fit=crop&q=80&w=600'
  }
];

// Generate the 4 new dummy files
newArticles.forEach(article => {
  let html = articleTemplate;
  html = html.replace(/<h1 class="article-title">.*?<\/h1>/s, `<h1 class="article-title">${article.title}</h1>`);
  html = html.replace(/<p class="article-subtitle">.*?<\/p>/s, `<p class="article-subtitle">${article.desc}</p>`);
  html = html.replace(/<span class="hero-tag">.*?<\/span>/, `<span class="hero-tag">${article.tag}</span>`);
  
  const bodyRegex = /(<div class="article-content">).*?(<div class="share-bar">)/s;
  html = html.replace(bodyRegex, `$1\n      <p>Content for ${article.title} is coming soon. Please check back later for the full guide.</p>\n\n      $2`);
  
  fs.writeFileSync(path.join(dir, `article-${article.id}.html`), html);
});

// Now let's build the 9 cards HTML
const allCards = [
  ...newArticles,
  {
    id: 'contract',
    title: 'Contract Labour Regulation: Compliance Essentials for 2024',
    tag: 'LABOUR LAW', time: '6 MIN READ', date: 'Oct 08, 2024',
    desc: 'With increased scrutiny on contract labour practices, understanding the CLRA Act is more critical than ever. This guide covers registration requirements, principal employer obligations, contractor compliance, wage parity, and recent amendments that affect your workforce management strategy.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'factory',
    title: 'Factory License Renewal: A Step-by-Step Compliance Guide',
    tag: 'FACTORY ACT', time: '7 MIN READ', date: 'Oct 05, 2024',
    desc: 'Renewing your factory license involves navigating multiple departments and meeting stringent safety standards. Our comprehensive guide walks you through the entire process — from document preparation and inspection readiness to dealing with state-specific variations and timeline management.',
    img: 'https://images.unsplash.com/photo-1504917595217-d4bffc6481cb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '', // maps to article.html
    title: 'Navigating the New Wage Codes: What Employers Need to Know',
    tag: 'COMPLIANCE', time: '5 MIN READ', date: 'Oct 01, 2024',
    desc: 'A comprehensive breakdown of how the impending Labour Code implementation will affect your payroll structure, basic wage calculations, PF contributions, and overall compliance obligations for employers across all sectors.',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    link: '/article.html'
  },
  {
    id: 'fire',
    title: 'The Ultimate Checklist for Fire Safety NOC Renewals in 2024',
    tag: 'SAFETY', time: '3 MIN READ', date: 'Sep 28, 2024',
    desc: 'Ensure your commercial premises meet the latest National Building Code requirements before the inspector arrives. We break down all mandatory fire safety measures, documentation requirements, and common reasons for NOC rejection.',
    img: 'https://images.unsplash.com/photo-1585834898734-7d501b1b4279?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'posh',
    title: 'Why External Members are Critical for your POSH IC',
    tag: 'HR STRATEGY', time: '4 MIN READ', date: 'Sep 25, 2024',
    desc: 'Understanding the legal mandate and strategic benefit of having unbiased external representation on your Internal Committee. Learn the qualifications required, selection process, and compliance consequences of non-appointment.',
    img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600'
  }
];

let cardsHtml = '';
allCards.forEach(c => {
  const href = c.link ? c.link : `/article-${c.id}.html`;
  cardsHtml += `
        <article class="art-card">
          <div class="art-img-wrap"><img src="${c.img}" alt="${c.tag}" loading="lazy"/></div>
          <div class="art-body">
            <div class="art-meta"><span class="art-cat">${c.tag}</span><span>${c.time}</span></div>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <div class="art-footer">
              <div class="art-author"><img src="/logo.png" style="filter:grayscale(1) contrast(2);" alt="Czar" loading="lazy"/><span>Czar Research</span></div>
              <a href="${href}" class="art-read">Read Guide</a>
            </div>
          </div>
        </article>
  `;
});

let insightsHtml = fs.readFileSync(path.join(dir, 'insights.html'), 'utf8');

const gridStart = '<div class="articles-grid">';
const gridEnd = '</div>\n    </div>\n  </section>\n\n  <!-- DOWNLOADS & TOOLS + GOVT UPDATES -->';

const startIndex = insightsHtml.indexOf(gridStart);
const endIndex = insightsHtml.indexOf(gridEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const before = insightsHtml.substring(0, startIndex + gridStart.length);
  const after = insightsHtml.substring(endIndex);
  
  fs.writeFileSync(path.join(dir, 'insights.html'), before + '\n' + cardsHtml + '      ' + after);
  console.log("Successfully replaced grid with 9 cards!");
} else {
  console.log("Could not find grid boundaries in insights.html");
}
