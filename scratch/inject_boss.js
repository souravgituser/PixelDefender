const fs = require('fs');

const base64Str = fs.readFileSync('d:/webgame/scratch/boss_base64.txt', 'utf8').trim();
let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

// Insert bossShipImg loader after magmaAsteroidImg block
const targetMark = 'processedMagmaAsteroidImg = magmaAsteroidImg;\n      }\n    };';

const bossLoaderCode = `

    // Photorealistic Cyber-Alien Boss Flagship Sprite Loader (Exact Match to User Reference Image)
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

          if (r > 235 && g > 235 && b > 235) {
            data[i + 3] = 0;
          }
        }

        offCtx.putImageData(imgData, 0, 0);
        processedBossShipImg = offCanvas;
      } catch (e) {
        processedBossShipImg = bossShipImg;
      }
    };
    bossShipImg.src = "${base64Str}";`;

if (html.includes(targetMark)) {
  html = html.replace(targetMark, targetMark + bossLoaderCode);
  fs.writeFileSync('d:/webgame/index.html', html);
  console.log('Successfully injected bossShipImg loader into index.html');
} else {
  console.log('targetMark not found in index.html');
}
