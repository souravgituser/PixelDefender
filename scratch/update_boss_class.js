const fs = require('fs');

let html = fs.readFileSync('d:/webgame/index.html', 'utf8');

const startMarker = '    // Stage Boss Flagship Class\n    class BossEnemy {';
const endMarker = '        ctx.fillStyle = theme.primary;\n        ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPct, barHeight - 4);\n        ctx.restore();\n      }\n    }';

const newBossCode = `    // Stage Boss Flagship Class (Overhauled Cyber-Alien Boss Leviathan)
    class BossEnemy {
      constructor(stage, canvasWidth) {
        this.stage = stage;
        this.canvasWidth = canvasWidth;
        this.x = canvasWidth / 2;
        this.y = -120;
        this.targetY = 160;
        this.radius = 75; // Large impressive boss collision radius
        this.hp = 35 + stage * 15;
        this.maxHp = this.hp;
        this.alive = true;
        this.vx = 2.4 + Math.min(stage * 0.3, 2.0);
        this.lastShot = Date.now();
        this.shootInterval = Math.max(400, 1400 - stage * 100);
        this.lastPowerRelease = Date.now();
        this.powerElementInterval = 5000;
        this.hasDroppedHalfHpLife = false;

        // Boss Firing Pattern States
        this.firingMode = 0; // 0: Dual Thruster Barrage, 1: Radial Eye Nova, 2: Claw Homing Swarm, 3: Desperation Beam
        this.lastModeSwitch = Date.now();
        this.modeInterval = 6500; // Switch firing style every 6.5s

        const names = [
          "NEBULA CYBER-LEVIATHAN",
          "VENUS VOID HARVESTER",
          "EARTH GUARDIAN STATION",
          "MARS CRIMSON DREADNOUGHT",
          "JUPITER STORM BEHEMOTH",
          "SATURN RING SENTINEL",
          "URANUS FROST TITAN",
          "NEPTUNE ABYSS COLOSSUS",
          "PLUTO VOID SINGULARITY"
        ];
        const idx = (stage - 1) % names.length;
        this.name = names[idx];
        this.title = \`STAGE \${stage} BOSS - \${this.name}\`;
      }

      update(enemyLasers, enemies, theme, powerups) {
        if (this.y < this.targetY) {
          this.y += 2.5;
        } else {
          // Horizontal patrol movement
          this.x += this.vx;
          if (this.x - this.radius < 40 || this.x + this.radius > this.canvasWidth - 40) {
            this.vx *= -1;
          }

          const now = Date.now();

          // Switch Boss Firing Style Pattern every 6.5 seconds
          if (now - this.lastModeSwitch > this.modeInterval) {
            this.lastModeSwitch = now;
            this.firingMode = (this.firingMode + 1) % 4;
          }

          // 1. Drop Boss Power Element Orbs & Heart PowerUp
          if (now - this.lastPowerRelease > this.powerElementInterval) {
            this.lastPowerRelease = now;
            const powerOrb = new Laser(this.x, this.y + 50, (Math.random() - 0.5) * 1.8, 4.2, '#a855f7');
            powerOrb.isPowerOrb = true;
            powerOrb.width = 30;
            powerOrb.height = 30;
            enemyLasers.push(powerOrb);

            if (powerups && Math.random() < 0.35) {
              powerups.push(new PowerUp(this.x, this.y + 40, 'HEART'));
            }
          }

          // 2. Overhauled Boss Firing Style Patterns
          if (now - this.lastShot > this.shootInterval) {
            this.lastShot = now;

            // Health-based desperation mode override when HP < 40%
            const hpRatio = this.hp / this.maxHp;
            const currentMode = hpRatio < 0.4 ? 3 : this.firingMode;

            if (currentMode === 0) {
              // Firing Style 1: Dual Thruster Plasma Streams (Left & Right Bottom Cannons)
              const laser1 = new Laser(this.x - 45, this.y + 55, -1.2, 8.5, '#a855f7');
              const laser2 = new Laser(this.x + 45, this.y + 55, 1.2, 8.5, '#a855f7');
              laser1.width = 14; laser1.height = 32;
              laser2.width = 14; laser2.height = 32;
              enemyLasers.push(laser1);
              enemyLasers.push(laser2);
            }
            else if (currentMode === 1) {
              // Firing Style 2: Central Eye Core 8-Way Radial Nova Burst
              for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + (now * 0.001);
                const vx = Math.cos(angle) * 5.5;
                const vy = Math.sin(angle) * 5.5 + 3.0; // Bias downward
                const novaBolt = new Laser(this.x, this.y + 10, vx, vy, '#d946ef');
                novaBolt.width = 18; novaBolt.height = 18;
                enemyLasers.push(novaBolt);
              }
            }
            else if (currentMode === 2) {
              // Firing Style 3: Claw Pincer Homing Missiles & Arc Waves
              const missileL = new Laser(this.x - 80, this.y + 60, -3.0, 6.0, '#c084fc', true);
              const missileR = new Laser(this.x + 80, this.y + 60, 3.0, 6.0, '#c084fc', true);
              missileL.width = 16; missileL.height = 28;
              missileR.width = 16; missileR.height = 28;
              enemyLasers.push(missileL);
              enemyLasers.push(missileR);

              // Center burst
              enemyLasers.push(new Laser(this.x, this.y + 50, 0, 9.0, '#00f3ff'));
            }
            else {
              // Firing Style 4: Desperation Super Beam Charge & Minion Escort Spawn
              const beam = new Laser(this.x, this.y + 65, 0, 12.0, '#ff0055');
              beam.width = 36;
              beam.height = 55;
              enemyLasers.push(beam);

              // Side plasma pulses
              enemyLasers.push(new Laser(this.x - 60, this.y + 45, -2, 7.5, '#a855f7'));
              enemyLasers.push(new Laser(this.x + 60, this.y + 45, 2, 7.5, '#a855f7'));

              // Spawn minion interceptor occasionally
              if (enemies && Math.random() < 0.25 && enemies.length < 4) {
                enemies.push(new Enemy(this.x + (Math.random() - 0.5) * 100, this.y + 20, 'INTERCEPTOR', 1.2));
              }
            }
          }
        }
      }

      draw(ctx, theme, enableGlow = true) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (enableGlow) {
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#a855f7';
        }

        // 1. Renders the User's Photorealistic Cyber-Alien Flagship Sprite
        const bossSpriteToDraw = processedBossShipImg || bossShipImg;
        if (bossSpriteToDraw && (bossSpriteToDraw.complete || bossSpriteToDraw instanceof HTMLCanvasElement)) {
          const drawW = 200;
          const drawH = 150;
          ctx.drawImage(bossSpriteToDraw, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          // Procedural fallback matching mechanical claw alien ship
          ctx.strokeStyle = '#a855f7';
          ctx.fillStyle = '#0a0d16';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 70); ctx.lineTo(60, 20); ctx.lineTo(90, -30); ctx.lineTo(40, -60);
          ctx.lineTo(0, -35); ctx.lineTo(-40, -60); ctx.lineTo(-90, -30); ctx.lineTo(-60, 20);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          // Inner glowing core
          ctx.fillStyle = '#d946ef';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Draw Boss Top Health Bar Overlay
        const barWidth = 360;
        const barHeight = 12;
        const barX = (this.canvasWidth - barWidth) / 2;
        const barY = 75;
        const hpPct = Math.max(0, this.hp / this.maxHp);

        ctx.save();
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillStyle = theme ? theme.primary : '#00f3ff';
        ctx.textAlign = 'center';
        if (enableGlow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = theme ? theme.primary : '#00f3ff';
        }
        ctx.fillText(this.title, this.canvasWidth / 2, barY - 4);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = theme ? theme.primary : '#00f3ff';
        ctx.lineWidth = 2;
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = theme ? theme.primary : '#00f3ff';
        ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPct, barHeight - 4);
        ctx.restore();
      }
    }`;

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const endTotal = endIndex + endMarker.length;
  html = html.substring(0, startIndex) + newBossCode + html.substring(endTotal);
  fs.writeFileSync('d:/webgame/index.html', html);
  console.log('Successfully updated BossEnemy class in index.html!');
} else {
  console.log('Failed to find start/end markers in index.html. Start:', startIndex, 'End:', endIndex);
}
