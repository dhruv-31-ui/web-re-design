const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove New Delhi Office from schema
content = content.replace(
  /,?\s*\{\s*"@type":\s*"WebPage",\s*"name":\s*"New Delhi Office",\s*"url":\s*"https:\/\/www\.czarconsultancy\.com\/new-delhi"\s*\}/g,
  ''
);

// 2. Remove Gurugram Office from schema
content = content.replace(
  /,?\s*\{\s*"@type":\s*"WebPage",\s*"name":\s*"Gurugram Office",\s*"url":\s*"https:\/\/www\.czarconsultancy\.com\/gurugram"\s*\}/g,
  ''
);

// 3. Replace old favicon tags with the new one
content = content.replace(
  /<link rel="icon" href="\/favicon-32x32\.png"[^>]+>/g,
  ''
);
content = content.replace(
  /<link rel="icon" href="\/favicon-16x16\.png"[^>]+>/g,
  '<link rel="icon" type="image/png" href="/favicon.png" />'
);
content = content.replace(
  /<link rel="shortcut icon" href="\/favicon-16x16\.png" \/>/g,
  ''
);
content = content.replace(
  /<link rel="apple-touch-icon"[^>]+>/g,
  ''
);

fs.writeFileSync('index.html', content);
console.log('Fixed index.html schema and favicon');
