const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace Hero Section HTML
const heroRegex = /<!-- HERO SLIDER -->[\s\S]*?<\/section>/;
const newHeroHTML = `<!-- CINEMATIC HERO -->
<section class="hero-slider-section">
  <div class="slide active">
    <img class="slide-bg" src="/hero2.png" alt="Compliance Advisory" loading="eager"/>
    <div class="slide-overlay" style="background: linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%);"></div>
    <div class="wrap slide-content" style="height:100%; display:flex; align-items:center;">
      <div>
        <span class="slide-eyebrow">India's Premier Compliance Firm</span>
        <h1 class="slide-title" style="font-size: clamp(56px, 7vw, 84px); margin-bottom: 32px; max-width: 800px;">Where expertise<br>meets precision.</h1>
        <p class="slide-desc" style="font-size: 22px; max-width: 650px; margin-bottom: 48px;">Delivering professional compliance, payroll, and advisory services across industries for over 15 years.</p>
        <a href="/contact" class="btn-primary" style="padding: 20px 48px; font-size: 15px;">Request Consultation <span>→</span></a>
      </div>
    </div>
  </div>
</section>`;

content = content.replace(heroRegex, newHeroHTML);

// Remove slider JS logic
const jsRegex = /\/\/ Hero Slider[\s\S]*?resetInterval\(\);/;
content = content.replace(jsRegex, '');

fs.writeFileSync('index.html', content);
console.log('Hero section updated.');
