const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

const targetMark = 'const maxC = Math.max(r, g, b);\n          if (maxC < 30 || (r > 242 && g > 242 && b > 242)) {\n            data[i + 3] = 0;\n          }';

const replacementMark = `if (r < 22 && g < 22 && b < 22) {
            data[i + 3] = 0;
          }`;

if (html.includes(targetMark)) {
  html = html.replace(targetMark, replacementMark);
  fs.writeFileSync('d:/webgame/index.html', html);
  console.log('Successfully fixed boss sprite alpha keying in index.html!');
} else {
  console.log('targetMark not found in index.html');
}
