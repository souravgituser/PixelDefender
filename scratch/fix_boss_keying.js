const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

const targetMark = 'if (r > 235 && g > 235 && b > 235) {\n            data[i + 3] = 0;\n          }';

const replacementMark = `const maxC = Math.max(r, g, b);
          if (maxC < 30 || (r > 242 && g > 242 && b > 242)) {
            data[i + 3] = 0;
          }`;

if (html.includes(targetMark)) {
  html = html.replace(targetMark, replacementMark);
  fs.writeFileSync('d:/webgame/index.html', html);
  console.log('Successfully updated boss sprite background keying in index.html');
} else {
  console.log('targetMark not found in index.html');
}
