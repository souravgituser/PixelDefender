const fs = require('fs');

const base64Str = fs.readFileSync('d:/webgame/scratch/magma_base64.txt', 'utf8').trim();
let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

const target = "magmaAsteroidImg.src = 'assets/asteroid_magma.png';";
const replacement = "magmaAsteroidImg.src = \"" + base64Str + "\";";

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('d:/webgame/index.html', html);
  console.log('Successfully injected base64 magma asteroid image data URL!');
} else {
  console.log('Target string not found');
}
