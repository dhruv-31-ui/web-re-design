const fs = require('fs');

function updateFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
      updateFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = false;
      
      if (!content.includes('<link rel="icon" type="image/png" href="/favicon.png" />')) {
        content = content.replace('</head>', '  <link rel="icon" type="image/png" href="/favicon.png" />\n</head>');
        updated = true;
      }
      
      if (fullPath.includes('index.html') && content.includes('"New Delhi Office"')) {
        // Regex to match the New Delhi Office JSON block
        const regex = /,\s*\{\s*"@type":\s*"WebPage",\s*"name":\s*"New Delhi Office",\s*"url":\s*"https:\/\/www\.czarconsultancy\.com\/new-delhi"\s*\}/g;
        if (regex.test(content)) {
          content = content.replace(regex, '');
          updated = true;
        } else {
           console.log('Regex failed to match New Delhi Office in ' + fullPath);
        }
      }

      if (fullPath.includes('index.html') && content.includes('"Gurugram Office"')) {
        const regex = /,\s*\{\s*"@type":\s*"WebPage",\s*"name":\s*"Gurugram Office",\s*"url":\s*"https:\/\/www\.czarconsultancy\.com\/gurugram"\s*\}/g;
        if (regex.test(content)) {
          content = content.replace(regex, '');
          updated = true;
        }
      }
      
      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Favicon added and Schema updated for ' + fullPath);
      }
    }
  }
}

updateFiles('.');
