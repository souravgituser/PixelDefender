const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

// Find and remove the huge base64 boss image src assignment
// Replace the entire bossShipImg setup block with nothing (we'll draw boss on canvas)
const bossImgBlock = `    // Photorealistic Cyber-Alien Boss Flagship Sprite Loader (Exact Match to User Reference Image)
    const bossShipImg = new Image();
    let processedBossShipImg = null;

    bossShipImg.onload = () => {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = bossShipImg.width;
        offCanvas.height = bossShipImg.height;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(bossShipImg, 0, 0);

        const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        const data = imgData.data;

        // Key out white/light background around boss flagship sprite with smooth edge fading
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r < 22 && g < 22 && b < 22) {
            data[i + 3] = 0;
          }
        }

        offCtx.putImageData(imgData, 0, 0);
        processedBossShipImg = bossShipImg;
      } catch (e) {
        processedBossShipImg = bossShipImg;
      }
    };`;

// Find the position of the bossImgBlock
const pos = html.indexOf('    // Photorealistic Cyber-Alien Boss Flagship Sprite Loader');
if (pos === -1) {
  console.log('ERROR: Could not find bossImgBlock start');
  process.exit(1);
}

// Find the end of bossShipImg.src = "data:..." line
const srcLineStart = html.indexOf('    bossShipImg.src = "data:', pos);
if (srcLineStart === -1) {
  console.log('ERROR: Could not find bossShipImg.src start');
  process.exit(1);
}

// Find the end of the bossShipImg.src line (it ends with ";")
// Since the base64 is massive, we search for the pattern after it
const srcLineEnd = html.indexOf('";', srcLineStart);
if (srcLineEnd === -1) {
  console.log('ERROR: Could not find bossShipImg.src end');
  process.exit(1);
}

const blockEnd = srcLineEnd + 2; // include the "; part

console.log('Found boss image block:');
console.log('  Block start pos:', pos);
console.log('  Src line start:', srcLineStart);
console.log('  Src line end:', blockEnd);
console.log('  Total chars to remove:', blockEnd - pos);

// Remove the entire block
html = html.substring(0, pos) + html.substring(blockEnd);

fs.writeFileSync('d:/webgame/index.html', html);
console.log('Successfully removed boss base64 image block from index.html!');
console.log('New file size:', fs.statSync('d:/webgame/index.html').size, 'bytes');
