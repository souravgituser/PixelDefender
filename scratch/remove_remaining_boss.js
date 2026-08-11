const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

// Find and remove all remaining bossShipImg blocks (the ones with the base64 src)
const bossShipImgMarker = 'const bossShipImg = new Image();';
const srcMarker = 'bossShipImg.src = "data:';

// Find position of bossShipImg block
const imgStart = html.indexOf('    // Photorealistic Cyber-Alien Boss Flagship Sprite Loader');
if (imgStart === -1) {
  console.log('No more bossShipImg blocks found');
  process.exit(0);
}

// Find the src line
const srcPos = html.indexOf(srcMarker, imgStart);
if (srcPos === -1) {
  console.log('bossShipImg block found but no src line found');
  process.exit(1);
}

// Find end of src line (look for the closing "; that ends the data URL)
const srcEnd = html.indexOf('";', srcPos);
if (srcEnd === -1) {
  console.log('Could not find end of bossShipImg.src');
  process.exit(1);
}

const removeEnd = srcEnd + 2; // include ";
console.log('Removing block from position', imgStart, 'to', removeEnd);
console.log('Characters to remove:', removeEnd - imgStart);

html = html.substring(0, imgStart) + html.substring(removeEnd);

fs.writeFileSync('d:/webgame/index.html', html);
console.log('Successfully removed bossShipImg block!');
console.log('New file size:', fs.statSync('d:/webgame/index.html').size, 'bytes');

// Check if another one exists
const remaining = html.indexOf(bossShipImgMarker);
if (remaining !== -1) {
  console.log('WARNING: Another bossShipImg block found at position', remaining);
} else {
  console.log('No more bossShipImg blocks remaining');
}
