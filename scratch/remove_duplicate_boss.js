const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

// Find the second occurrence of the bossShipImg block
const marker = '    // Photorealistic Cyber-Alien Boss Flagship Sprite Loader (Exact Match to User Reference Image)';
const firstPos = html.indexOf(marker);
const secondPos = html.indexOf(marker, firstPos + 1);

if (secondPos === -1) {
  console.log('Only one occurrence found - no duplicate to remove');
  process.exit(0);
}

console.log('Found second bossShipImg block at position:', secondPos);

// Find the end of the bossShipImg.src line at the second position
const srcLineStart = html.indexOf('    bossShipImg.src = "data:', secondPos);
if (srcLineStart === -1) {
  console.log('ERROR: Second bossShipImg.src start not found');
  process.exit(1);
}

const srcLineEnd = html.indexOf('";', srcLineStart);
if (srcLineEnd === -1) {
  console.log('ERROR: Second bossShipImg.src end not found');
  process.exit(1);
}

const blockEnd = srcLineEnd + 2; // include ";
console.log('Second block spans positions:', secondPos, 'to', blockEnd);
console.log('Characters to remove:', blockEnd - secondPos);

// Remove the second block
html = html.substring(0, secondPos) + html.substring(blockEnd);

fs.writeFileSync('d:/webgame/index.html', html);
console.log('Successfully removed duplicate bossShipImg block!');
console.log('New file size:', fs.statSync('d:/webgame/index.html').size, 'bytes');
