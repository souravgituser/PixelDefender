const fs = require('fs');

const html = fs.readFileSync('d:/webgame/index.html', 'utf8');
const searchStr = 'const bossShipImg = new Image();';

if (html.includes(searchStr)) {
  console.log('bossShipImg loader is present in index.html');
  const pos = html.indexOf(searchStr);
  console.log(html.substring(pos, pos + 250));
} else {
  console.log('bossShipImg loader NOT found');
}
