// Quick syntax check - extract the JS portion and validate key structures
const fs = require('fs');
const html = fs.readFileSync('d:/webgame/index.html', 'utf8');

// Check for key boss-related markers
const checks = [
  'class BossEnemy {',
  'this.firingMode = 0;',
  'firingMode = (this.firingMode + 1) % 4',
  'currentMode === 0',  // mode 0: dual thruster
  'currentMode === 1',  // mode 1: radial nova
  'currentMode === 2',  // mode 2: claw homing
  'Desperation Super Beam',  // mode 3
  'Cyber-Alien Leviathan Boss Ship',  // canvas drawing
  'CLAW PINCERS',
  'MAIN HULL',
  'CENTRAL EYE CORE',
  'ENGINE THRUSTERS',
  'ctx.restore();', // properly closed
];

let allOk = true;
for (const check of checks) {
  if (html.includes(check)) {
    console.log('✓', check);
  } else {
    console.log('✗ MISSING:', check);
    allOk = false;
  }
}

// Check no leftover bossShipImg references
if (html.includes('bossShipImg')) {
  console.log('✗ WARNING: bossShipImg reference still present');
  allOk = false;
} else {
  console.log('✓ No bossShipImg references (cleaned)');
}

console.log('\nFile size:', fs.statSync('d:/webgame/index.html').size, 'bytes');
console.log(allOk ? '\n✅ All checks PASSED!' : '\n❌ Some checks FAILED!');
