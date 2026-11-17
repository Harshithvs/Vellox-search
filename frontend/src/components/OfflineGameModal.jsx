import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, Play, RotateCcw, Volume2, VolumeX, X, Trophy, Heart, Zap, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

// Lightweight Web Audio API Synthesizer (100% offline, zero network assets)
class GameSoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playScore() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.12);
    });
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playBoost() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.2);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

const sfx = new GameSoundFX();

export default function OfflineGameModal({
  isOpen,
  onClose,
  isOnline = true,
  onBackToSearch
}) {
  const [gameMode, setGameMode] = useState('surf'); // 'surf' (Edge Surf) or 'dino' (Chrome Dino)
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('vellox_offline_surf_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [dinoHighScore, setDinoHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('vellox_offline_dino_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [boostActive, setBoostActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const gameStateRef = useRef({});

  // Toggle Mute
  const handleToggleMute = () => {
    sfx.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Switch Game Mode
  const handleSelectMode = (mode) => {
    setGameMode(mode);
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setLives(mode === 'surf' ? 3 : 1);
  };

  // -------------------------------------------------------------
  // GAME ENGINE: SURF RUN (Edge Surf Style) & DINO RUN (Chrome Dino Style)
  // -------------------------------------------------------------
  const initSurfGame = useCallback((canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    gameStateRef.current = {
      mode: 'surf',
      player: {
        x: width / 2,
        y: 110,
        targetX: width / 2,
        width: 32,
        height: 48,
        speedX: 0,
        tilt: 0,
        invulnerable: 0,
        wakeTrail: []
      },
      speed: 4.8,
      baseSpeed: 4.8,
      boostTimer: 0,
      distance: 0,
      obstacles: [],
      items: [],
      particles: [],
      seaWaves: [
        { y: 50, speed: 1.2, amp: 14, offset: 0 },
        { y: 150, speed: 1.8, amp: 20, offset: 2 },
        { y: 280, speed: 2.3, amp: 16, offset: 4 },
        { y: 400, speed: 2.7, amp: 22, offset: 1 }
      ],
      keys: { left: false, right: false, boost: false }
    };
  }, []);

  const initDinoGame = useCallback((canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const groundY = height - 55;

    gameStateRef.current = {
      mode: 'dino',
      player: {
        x: 60,
        y: groundY - 44,
        width: 44,
        height: 44,
        vy: 0,
        isJumping: false,
        isDucking: false,
        groundY: groundY - 44
      },
      gravity: 0.85,
      jumpForce: -13.5,
      speed: 6.2,
      groundY: groundY,
      obstacles: [],
      clouds: [
        { x: 120, y: 50, speed: 0.8 },
        { x: 380, y: 75, speed: 1.1 },
        { x: 650, y: 40, speed: 0.9 }
      ],
      distance: 0,
      particles: [],
      keys: { jump: false, duck: false }
    };
  }, []);

  // Start / Restart Game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sfx.init();
    sfx.playJump();

    setGameOver(false);
    setIsPlaying(true);
    setScore(0);
    setLives(gameMode === 'surf' ? 3 : 1);

    if (gameMode === 'surf') {
      initSurfGame(canvas);
    } else {
      initDinoGame(canvas);
    }
  }, [gameMode, initSurfGame, initDinoGame]);

  // Handle Keyboard Controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const state = gameStateRef.current;
      if (!state) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying || gameOver) {
          startGame();
          return;
        }
      }

      if (state.mode === 'surf') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          state.keys.left = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          state.keys.right = true;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.code === 'Space') {
          state.keys.boost = true;
        }
      } else if (state.mode === 'dino') {
        if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          if (state.player && !state.player.isJumping) {
            state.player.vy = state.jumpForce;
            state.player.isJumping = true;
            sfx.playJump();
          }
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (state.player) {
            state.player.isDucking = true;
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      const state = gameStateRef.current;
      if (!state) return;

      if (state.mode === 'surf') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.keys.right = false;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.code === 'Space') state.keys.boost = false;
      } else if (state.mode === 'dino') {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (state.player) {
            state.player.isDucking = false;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, isPlaying, gameOver, startGame]);

  // Pointer / Touch steering for Surf
  const handleCanvasPointerMove = (e) => {
    const state = gameStateRef.current;
    if (!state || state.mode !== 'surf' || !state.player || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasRef.current.width;
    state.player.targetX = Math.max(30, Math.min(canvasRef.current.width - 30, x));
  };

  const handleCanvasPointerDown = (e) => {
    if (!isPlaying || gameOver) {
      startGame();
      return;
    }
    const state = gameStateRef.current;
    if (state && state.mode === 'dino') {
      if (state.player && !state.player.isJumping) {
        state.player.vy = state.jumpForce;
        state.player.isJumping = true;
        sfx.playJump();
      }
    } else if (state && state.mode === 'surf') {
      handleCanvasPointerMove(e);
    }
  };

  // -------------------------------------------------------------
  // MAIN ANIMATION LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas resolution safely
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const computedW = rect.width > 20 ? rect.width : (canvas.parentElement?.clientWidth || window.innerWidth * 0.85);
      const computedH = rect.height > 20 ? rect.height : (canvas.parentElement?.clientHeight || 450);
      canvas.width = Math.floor(computedW * dpr);
      canvas.height = Math.floor(computedH * dpr);
      if (gameStateRef.current && !isPlaying) {
        if (gameMode === 'surf') initSurfGame(canvas);
        else initDinoGame(canvas);
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (!isPlaying && !gameOver) {
      if (gameMode === 'surf') initSurfGame(canvas);
      else initDinoGame(canvas);
    }

    const render = () => {
      const state = gameStateRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || !state) return;

      const width = canvas.width;
      const height = canvas.height;

      // -----------------------------------------------------------
      // SURF RUN MODE
      // -----------------------------------------------------------
      if (state.mode === 'surf') {
        // Ocean gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(0.5, '#0ea5e9');
        grad.addColorStop(1, '#38bdf8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ambient foam waves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 3;
        state.seaWaves.forEach((wave) => {
          wave.offset += (wave.speed * state.speed) * 0.015;
          ctx.beginPath();
          for (let x = 0; x <= width; x += 20) {
            const y = (wave.y + Math.sin(x * 0.02 + wave.offset) * wave.amp) % height;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

        if (isPlaying && !gameOver) {
          state.distance += state.speed * 0.2;
          const currentScore = Math.floor(state.distance);
          setScore(currentScore);

          if (currentScore > highScore) {
            setHighScore(currentScore);
            try {
              localStorage.setItem('vellox_offline_surf_high', currentScore.toString());
            } catch {}
          }

          // Gradually speed up
          state.baseSpeed = 4.8 + Math.min(6, state.distance * 0.0035);

          // Boost state
          if (state.keys.boost && state.boostTimer <= 0) {
            state.speed = state.baseSpeed * 1.5;
            setBoostActive(true);
          } else if (state.boostTimer > 0) {
            state.boostTimer--;
            state.speed = state.baseSpeed * 1.7;
            setBoostActive(true);
          } else {
            state.speed = state.baseSpeed;
            setBoostActive(false);
          }

          // Player steering
          const p = state.player;
          if (state.keys.left) {
            p.speedX = -7;
            p.tilt = -0.3;
          } else if (state.keys.right) {
            p.speedX = 7;
            p.tilt = 0.3;
          } else if (p.targetX !== undefined) {
            const diff = p.targetX - p.x;
            p.speedX = Math.max(-8, Math.min(8, diff * 0.15));
            p.tilt = Math.max(-0.35, Math.min(0.35, p.speedX * 0.04));
          } else {
            p.speedX *= 0.85;
            p.tilt *= 0.85;
          }

          p.x += p.speedX;
          p.x = Math.max(25, Math.min(width - 25, p.x));

          // Surf wake trails
          if (Math.random() < 0.75) {
            p.wakeTrail.push({
              x: p.x + (Math.random() - 0.5) * 10,
              y: p.y - 10,
              r: 3 + Math.random() * 4,
              alpha: 0.8
            });
          }

          // Spawn obstacles (rocks, whirlpools, kraken tentacles, buoys)
          if (Math.random() < 0.028) {
            const obsTypes = ['rock', 'buoy', 'whirlpool', 'tentacle'];
            const type = obsTypes[Math.floor(Math.random() * obsTypes.length)];
            state.obstacles.push({
              x: Math.random() * (width - 80) + 40,
              y: height + 60,
              type: type,
              width: type === 'tentacle' ? 36 : type === 'whirlpool' ? 48 : 34,
              height: type === 'tentacle' ? 44 : type === 'whirlpool' ? 48 : 34,
              rot: Math.random() * Math.PI
            });
          }

          // Spawn items (boost arrows, star coins, extra hearts)
          if (Math.random() < 0.014) {
            const itemTypes = ['coin', 'coin', 'boost', 'heart'];
            const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            state.items.push({
              x: Math.random() * (width - 80) + 40,
              y: height + 50,
              type: type,
              width: 28,
              height: 28
            });
          }

          // Invulnerability timer countdown
          if (p.invulnerable > 0) p.invulnerable--;
        }

        // Draw Player Surf Wake
        const p = state.player;
        if (p) {
          for (let i = p.wakeTrail.length - 1; i >= 0; i--) {
            const w = p.wakeTrail[i];
            w.y -= state.speed * 0.7;
            w.alpha -= 0.02;
            w.r += 0.3;
            if (w.alpha <= 0) {
              p.wakeTrail.splice(i, 1);
              continue;
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${w.alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw & Update Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          if (isPlaying && !gameOver) {
            obs.y -= state.speed;
          }

          if (obs.y < -80) {
            state.obstacles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(obs.x, obs.y);

          if (obs.type === 'rock') {
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(-16, 12);
            ctx.lineTo(-12, -14);
            ctx.lineTo(8, -16);
            ctx.lineTo(16, 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(-12, -14);
            ctx.lineTo(2, -6);
            ctx.lineTo(8, -16);
            ctx.closePath();
            ctx.fill();
          } else if (obs.type === 'buoy') {
            // Red-white floating buoy
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-14, -3, 28, 6);
            ctx.strokeStyle = '#f87171';
            ctx.stroke();
          } else if (obs.type === 'whirlpool') {
            // Swirling water
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2.5;
            obs.rot += 0.08;
            ctx.rotate(obs.rot);
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 4; a += 0.3) {
              const r = (a / (Math.PI * 4)) * 20;
              const x = Math.cos(a) * r;
              const y = Math.sin(a) * r;
              if (a === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          } else if (obs.type === 'tentacle') {
            // Sea Monster Kraken Tentacle
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.moveTo(-12, 18);
            ctx.quadraticCurveTo(-18, -10, 4, -22);
            ctx.quadraticCurveTo(12, -8, 12, 18);
            ctx.closePath();
            ctx.fill();
            // Suction cups
            ctx.fillStyle = '#c4b5fd';
            ctx.beginPath();
            ctx.arc(-4, -6, 3, 0, Math.PI * 2);
            ctx.arc(2, 4, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          // Collision Detection with Player
          if (isPlaying && !gameOver && p && p.invulnerable <= 0) {
            const dist = Math.hypot(p.x - obs.x, p.y - obs.y);
            if (dist < (obs.width / 2 + p.width / 2 - 4)) {
              sfx.playCrash();
              p.invulnerable = 60; // 1 second invulnerable blink
              setLives((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                  setGameOver(true);
                  setIsPlaying(false);
                }
                return Math.max(0, next);
              });
              // Particle explosion
              for (let k = 0; k < 15; k++) {
                state.particles.push({
                  x: p.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#ffffff',
                  alpha: 1
                });
              }
            }
          }
        }

        // Draw & Update Collectible Items
        for (let i = state.items.length - 1; i >= 0; i--) {
          const item = state.items[i];
          if (isPlaying && !gameOver) {
            item.y -= state.speed;
          }

          if (item.y < -50) {
            state.items.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(item.x, item.y);

          if (item.type === 'coin') {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#78350f';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('★', 0, 1);
          } else if (item.type === 'boost') {
            // Speed Boost Ramp / Pad
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(0, -14);
            ctx.lineTo(12, 10);
            ctx.lineTo(-12, 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(6, 6);
            ctx.lineTo(-6, 6);
            ctx.closePath();
            ctx.fill();
          } else if (item.type === 'heart') {
            // Heart
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(-5, -4, 5, Math.PI, 0, false);
            ctx.arc(5, -4, 5, Math.PI, 0, false);
            ctx.lineTo(0, 9);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();

          // Item pickup
          if (isPlaying && !gameOver && p) {
            const dist = Math.hypot(p.x - item.x, p.y - item.y);
            if (dist < 28) {
              if (item.type === 'coin') {
                sfx.playScore();
                state.distance += 100;
              } else if (item.type === 'boost') {
                sfx.playBoost();
                state.boostTimer = 110;
              } else if (item.type === 'heart') {
                sfx.playScore();
                setLives((prev) => Math.min(3, prev + 1));
              }
              state.items.splice(i, 1);
            }
          }
        }

        // Draw Player Surfer
        if (p) {
          const isBlinking = p.invulnerable > 0 && Math.floor(p.invulnerable / 5) % 2 === 0;
          if (!isBlinking) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.tilt);

            // Surfboard (Neon teal with racing stripe)
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center stripe
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(-2, -18, 4, 36);

            // Surfer body & head
            ctx.fillStyle = '#f59e0b'; // Shirt
            ctx.beginPath();
            ctx.arc(0, -2, 6, 0, Math.PI * 2);
            ctx.fill();

            // Head & sunglasses
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath();
            ctx.arc(0, -9, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-3, -11, 6, 3);

            ctx.restore();
          }
        }
      }

      // -----------------------------------------------------------
      // CHROME DINO RUN MODE
      // -----------------------------------------------------------
      else if (state.mode === 'dino') {
        // Dino Desert Retro Clean Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        // Horizon Ground Line
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, state.groundY);
        ctx.lineTo(width, state.groundY);
        ctx.stroke();

        // Clouds
        ctx.fillStyle = '#cbd5e1';
        state.clouds.forEach((cloud) => {
          if (isPlaying && !gameOver) {
            cloud.x -= cloud.speed;
            if (cloud.x < -80) cloud.x = width + 40;
          }
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, 14, 0, Math.PI * 2);
          ctx.arc(cloud.x + 14, cloud.y - 6, 18, 0, Math.PI * 2);
          ctx.arc(cloud.x + 30, cloud.y, 14, 0, Math.PI * 2);
          ctx.fill();
        });

        const p = state.player;
        if (isPlaying && !gameOver) {
          state.distance += state.speed * 0.15;
          const currentScore = Math.floor(state.distance);
          setScore(currentScore);

          if (currentScore > dinoHighScore) {
            setDinoHighScore(currentScore);
            try {
              localStorage.setItem('vellox_offline_dino_high', currentScore.toString());
            } catch {}
          }

          // Physics for Jump
          p.vy += state.gravity;
          p.y += p.vy;

          if (p.y >= p.groundY) {
            p.y = p.groundY;
            p.vy = 0;
            p.isJumping = false;
          }

          // Speed increase
          state.speed = 6.2 + Math.min(7, state.distance * 0.004);

          // Obstacle spawning (Cactus clusters or Pterodactyls)
          if (Math.random() < 0.022 && (!state.obstacles.length || state.obstacles[state.obstacles.length - 1].x < width - 220)) {
            const isBird = Math.random() < 0.35 && state.distance > 200;
            state.obstacles.push({
              x: width + 30,
              y: isBird ? state.groundY - 50 : state.groundY - 38,
              width: isBird ? 36 : 24,
              height: isBird ? 24 : 38,
              type: isBird ? 'bird' : 'cactus'
            });
          }
        }

        // Draw & Update Obstacles
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          if (isPlaying && !gameOver) {
            obs.x -= state.speed;
          }

          if (obs.x < -60) {
            state.obstacles.splice(i, 1);
            continue;
          }

          if (obs.type === 'cactus') {
            ctx.fillStyle = '#16a34a';
            // Stem
            ctx.fillRect(obs.x + 8, obs.y, 8, obs.height);
            // Left arm
            ctx.fillRect(obs.x, obs.y + 10, 8, 4);
            ctx.fillRect(obs.x, obs.y + 4, 4, 10);
            // Right arm
            ctx.fillRect(obs.x + 16, obs.y + 14, 8, 4);
            ctx.fillRect(obs.x + 20, obs.y + 8, 4, 10);
          } else if (obs.type === 'bird') {
            ctx.fillStyle = '#475569';
            // Flapping bird
            ctx.beginPath();
            ctx.ellipse(obs.x + 16, obs.y + 10, 16, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            // Wings
            const wingY = Math.sin(state.distance * 0.2) * 8;
            ctx.beginPath();
            ctx.moveTo(obs.x + 10, obs.y + 10);
            ctx.lineTo(obs.x + 16, obs.y + wingY);
            ctx.lineTo(obs.x + 22, obs.y + 10);
            ctx.fill();
          }

          // Collision detection
          if (isPlaying && !gameOver && p) {
            const playerBox = {
              x: p.x + 6,
              y: p.isDucking ? p.y + 16 : p.y + 4,
              w: p.width - 12,
              h: p.isDucking ? p.height - 18 : p.height - 8
            };
            if (
              playerBox.x < obs.x + obs.width &&
              playerBox.x + playerBox.w > obs.x &&
              playerBox.y < obs.y + obs.height &&
              playerBox.y + playerBox.h > obs.y
            ) {
              sfx.playCrash();
              setGameOver(true);
              setIsPlaying(false);
              setLives(0);
            }
          }
        }

        // Draw Pixel T-Rex Dino
        if (p) {
          ctx.fillStyle = '#334155';
          if (p.isDucking) {
            // Ducking Dino
            ctx.fillRect(p.x, p.y + 18, 42, 22);
            ctx.fillRect(p.x + 36, p.y + 22, 12, 14); // Snout
            // Eye
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(p.x + 38, p.y + 24, 3, 3);
          } else {
            // Standing/Jumping Dino
            ctx.fillRect(p.x + 8, p.y + 8, 22, 26); // Body
            ctx.fillRect(p.x + 18, p.y - 4, 18, 16); // Head
            ctx.fillRect(p.x + 28, p.y + 2, 10, 10); // Snout
            // Eye
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(p.x + 24, p.y, 4, 4);
            ctx.fillStyle = '#334155';

            // Running legs
            const legOffset = Math.sin(state.distance * 0.3) > 0;
            if (p.isJumping) {
              ctx.fillRect(p.x + 10, p.y + 34, 4, 8);
              ctx.fillRect(p.x + 20, p.y + 34, 4, 8);
            } else if (legOffset) {
              ctx.fillRect(p.x + 10, p.y + 34, 4, 10);
              ctx.fillRect(p.x + 22, p.y + 34, 4, 6);
            } else {
              ctx.fillRect(p.x + 10, p.y + 34, 4, 6);
              ctx.fillRect(p.x + 22, p.y + 34, 4, 10);
            }
          }
        }
      }

      // Draw Particles
      if (state.particles) {
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha -= 0.03;
          if (pt.alpha <= 0) {
            state.particles.splice(i, 1);
            continue;
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isOpen, isPlaying, gameOver, gameMode, highScore, dinoHighScore, initSurfGame, initDinoGame]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex flex-col bg-slate-950/95 backdrop-blur-xl text-white transition-all select-none ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      {/* Top Offline Notification & Status Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl mb-2 sm:mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg flex items-center gap-2 font-semibold text-xs sm:text-sm ${
            !isOnline
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4 animate-pulse" />
                <span>ERR_INTERNET_DISCONNECTED • Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Internet Restored! ⚡</span>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Direct Offline Arcade</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-medium">
              {gameMode === 'surf' ? '🌊 Edge Surf Run' : '🦖 Chrome Dino Jump'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Game Switcher Tabs */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => handleSelectMode('surf')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                gameMode === 'surf'
                  ? 'bg-cyan-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌊 Surf
            </button>
            <button
              onClick={() => handleSelectMode('dino')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                gameMode === 'dino'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🦖 Dino
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* If back online, prompt return */}
          {isOnline && onBackToSearch && (
            <button
              onClick={onBackToSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 animate-bounce"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Search</span>
            </button>
          )}

          {/* Close / Minimize to Search */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Minimize game to dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900 min-h-[420px] h-[520px]">
        {/* In-Game HUD Overlay */}
        <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          {/* Hearts / Lives (For Surf Mode) */}
          {gameMode === 'surf' ? (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-transform ${
                    i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 scale-75'
                  }`}
                />
              ))}
              {boostActive && (
                <span className="flex items-center gap-1 ml-2 text-xs font-bold text-emerald-400 animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400" /> BOOST
                </span>
              )}
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-slate-300">
              CLASSIC DINO RUN
            </div>
          )}

          {/* Score & High Score */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 font-mono text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>HI {gameMode === 'surf' ? highScore.toString().padStart(5, '0') : dinoHighScore.toString().padStart(5, '0')}</span>
            </div>
            <div className="text-white font-extrabold text-base tracking-wider">
              {score.toString().padStart(5, '0')}
            </div>
          </div>
        </div>

        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-sm p-6 text-center animate-fadeIn">
            {gameOver ? (
              <>
                <div className="text-5xl mb-3 animate-bounce">
                  {gameMode === 'surf' ? '🌊 💥' : '🦖 🌵'}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-rose-500 tracking-tight mb-1">
                  GAME OVER
                </h2>
                <p className="text-slate-300 text-sm mb-4">
                  Final Score: <span className="font-mono font-bold text-amber-400 text-lg">{score}</span>
                </p>

                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Play Again (Spacebar)</span>
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl sm:text-6xl mb-3 select-none">
                  {gameMode === 'surf' ? '🏄‍♂️' : '🦖'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  {gameMode === 'surf' ? 'velloX Wave Rider (Edge Surf)' : 'velloX Dino Jump'}
                </h2>
                <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                  {gameMode === 'surf'
                    ? 'Surf down infinite ocean waves! Dodge rocks, whirlpools & tentacles. Collect speed boosts and star coins.'
                    : 'Jump over desert cacti and dodge low-flying pterodactyls in this timeless arcade runner.'}
                </p>

                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Start Game (Press Space)</span>
                </button>
              </>
            )}

            {/* Controls Guide */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-mono">
              {gameMode === 'surf' ? (
                <>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">←</kbd>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">→</kbd>
                    <span>Steer</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">↓</kbd> / 
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">Space</kbd>
                    <span>Speed Boost</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <span>Touch / Mouse Steering Supported</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">Space</kbd> / 
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">↑</kbd>
                    <span>Jump</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">↓</kbd>
                    <span>Duck</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtle Offline Footer Helper */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-2 pt-2 text-[11px] text-slate-500">
        <div>
          Auto-launched on offline connection. Progress & high scores are preserved locally.
        </div>
        <button
          onClick={onClose}
          className="text-cyan-400 hover:underline"
        >
          View Cached Search Dashboard
        </button>
      </div>
    </div>
  );
}

