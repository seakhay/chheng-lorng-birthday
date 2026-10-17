import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, Heart, Gift, Volume2, VolumeX, Cake, Camera, 
  RotateCcw, Settings, X, Mail, Flame, ChevronLeft, ChevronRight, 
  Maximize2, Upload, Star, Music, Award
} from 'lucide-react';

// ==========================================
// 1. CONFIGURATION DATA FOR CHHENG LORNG
// ==========================================
const INITIAL_CONFIG = {
  sisterName: "Chheng Lorng",
  senderName: "Your Loving Sibling",
  heroHeading: "Happy Birthday, Chheng Lorng! 🎂💗",
  heroSubtitle: "Today is your special day, and I created this little magical world just for you.",
  wishPrompt: "Close your eyes, make a heartfelt birthday wish, and blow out the candles...",
  wishGranted: "May all your beautiful wishes come true, Chheng Lorng! 💖✨",
  letter: {
    title: "A Letter From My Heart 💌",
    body: `To my wonderful sister Chheng Lorng,

Happy Birthday to one of the most radiant, loving, and truly special people in my life!

I feel endlessly blessed to have you as my sister. Thank you for filling our days with laughter, for bringing warmth into our family, and for being the kind, gentle, and cheerful soul that you are.

On this special birthday, I wish you endless happiness, good health, thriving success, peace in your spirit, and the courage to pursue every single dream tucked inside your heart.

May every new day give you countless reasons to smile, surrounded by people who cherish and appreciate you. No matter where our journeys lead or how fast time flies, you will always be my beloved sister, and you will always have a special place in my heart.

I hope this little magical surprise reminds you just how deeply you are loved and appreciated.

Happy Birthday, Chheng Lorng! May your new year of life be filled with sweet surprises, treasured memories, and magical moments.

With all my love and blessings,
Your sibling 💗`
  },
  memories: [
    {
      id: 1,
      title: "Family Celebration",
      caption: "Looking so elegant in your pink dress alongside the family. A truly treasured celebration!",
      tag: "Family Love",
      date: "Special Occasion",
      imgUrl: "src/assets/pic1.jpg"
    },
    {
      id: 2,
      title: "Sweet Heart Pose",
      caption: "Making hearts and spreading positive energy wherever you are. Your sweet smile lights up everything!",
      tag: "Pure Joy",
      date: "Happy Days",
      imgUrl: "src/assets/pic2.jpg"
    },
    {
      id: 3,
      title: "Radiant Smile",
      caption: "That natural, beautiful smile that brings so much peace and brightness to our hearts.",
      tag: "Radiance",
      date: "Sunny Memories",
      imgUrl: "src/assets/pic3.jpg"
    },
    {
      id: 4,
      title: "Sweet & Playful",
      caption: "Resting your chin and looking effortlessly cute. The best sister in the entire world!",
      tag: "Sisterhood",
      date: "Treasured Moments",
      imgUrl: "src/assets/pic4.jpg"
    }
  ],
  finalSurprise: {
    heading: "One Last Little Surprise... 💝",
    message: "Chheng Lorng, you make our family brighter just by being you. I hope your birthday is as wonderful, sparkling, and breathtaking as you are. Happy Birthday, Sis! 🎂💖"
  }
};

// ==========================================
// 2. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO)
// Seamless background music box & magical effects
// ==========================================
class BirthdaySoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.volume = 0.28;
    // Happy Birthday melody notes (Frequencies in Hz)
    this.melody = [
      392.00, 392.00, 440.00, 392.00, 523.25, 493.88,
      392.00, 392.00, 440.00, 392.00, 587.33, 523.25,
      392.00, 392.00, 783.99, 659.25, 523.25, 493.88, 440.00,
      698.46, 698.46, 659.25, 523.25, 587.33, 523.25
    ];
    this.durations = [
      0.35, 0.35, 0.7, 0.7, 0.7, 1.4,
      0.35, 0.35, 0.7, 0.7, 0.7, 1.4,
      0.35, 0.35, 0.7, 0.7, 0.7, 0.7, 1.4,
      0.35, 0.35, 0.7, 0.7, 0.7, 1.8
    ];
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    gain.gain.setValueAtTime(0.3 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playSparkles() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900 + Math.random() * 900, t + i * 0.06);
      gain.gain.setValueAtTime(0.08 * this.volume, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.3);
    }
  }

  playExtinguish() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.55;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 750;
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.08 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 0.55);
  }

  startMusic(cb) {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    if (cb) cb(true);
    this.tick(cb);
  }

  tick(cb) {
    if (!this.isPlaying || !this.ctx) return;
    const freq = this.melody[this.noteIndex];
    const dur = this.durations[this.noteIndex];
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(freq * 2, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12 * this.volume, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.3);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    sub.start(t);
    osc.stop(t + dur * 1.35);
    sub.stop(t + dur * 1.35);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timer = setTimeout(() => this.tick(cb), dur * 800);
  }

  stopMusic(cb) {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (cb) cb(false);
  }

  toggle(cb) {
    if (this.isPlaying) this.stopMusic(cb);
    else this.startMusic(cb);
  }

  setVolume(v) {
    this.volume = v;
  }
}

const soundEngine = new BirthdaySoundEngine();

// ==========================================
// 3. FULLSCREEN CONFETTI CANNON
// ==========================================
function ConfettiOverlay({ active, onFinished }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFD6E8', '#DCCBFF', '#F4D58D', '#9B7BFF', '#FF9ECF', '#FFF8F0', '#FF6584'];
    const count = window.innerWidth < 768 ? 95 : 180;
    const particles = Array.from({ length: count }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.55 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 22,
      vy: -Math.random() * 18 - 5,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.15,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'heart'
    }));

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.rSpeed;
        p.opacity -= 0.0048;

        if (p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
          } else {
            // Heart shape
            ctx.beginPath();
            const top = p.size * 0.3;
            ctx.moveTo(0, top);
            ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, top);
            ctx.bezierCurveTo(-p.size / 2, (p.size + top) / 2, 0, (p.size + top) / 1.5, 0, p.size);
            ctx.bezierCurveTo(0, (p.size + top) / 1.5, p.size / 2, (p.size + top) / 2, p.size / 2, top);
            ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, top);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      });

      frame++;
      if (alive > 0 && frame < 320) {
        animId = requestAnimationFrame(loop);
      } else if (onFinished) {
        onFinished();
      }
    };

    loop();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onFinished]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />;
}

// ==========================================
// 4. THREE.JS 3D OPENING GIFT SCENE
// ==========================================
function ThreeGiftScene({ isOpening, onOpened }) {
  const containerRef = useRef(null);
  const animRef = useRef({ progress: 0, opened: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xfff5f8, 1.3));
    const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    mainLight.position.set(4, 8, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const innerGlow = new THREE.PointLight(0xffdf88, 0, 8);
    innerGlow.position.set(0, 0.6, 0);
    scene.add(innerGlow);

    // Gift Construction
    const giftGroup = new THREE.Group();
    scene.add(giftGroup);

    const boxMat = new THREE.MeshStandardMaterial({ color: 0xffadc9, roughness: 0.35, metalness: 0.15 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf4d58d, roughness: 0.2, metalness: 0.75, emissive: 0x332200 });

    const boxHeight = 1.5;
    const boxSize = 1.8;
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxSize, boxHeight, boxSize), boxMat);
    boxMesh.position.y = boxHeight / 2;
    boxMesh.castShadow = true;
    giftGroup.add(boxMesh);

    // Vertical & Horizontal Ribbons
    const ribV = new THREE.Mesh(new THREE.BoxGeometry(0.32, boxHeight + 0.02, boxSize + 0.03), goldMat);
    ribV.position.y = boxHeight / 2;
    giftGroup.add(ribV);

    const ribH = new THREE.Mesh(new THREE.BoxGeometry(boxSize + 0.03, boxHeight + 0.02, 0.32), goldMat);
    ribH.position.y = boxHeight / 2;
    giftGroup.add(ribH);

    // Lid & Bow
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, boxHeight, 0);
    giftGroup.add(lidGroup);

    const lidSize = boxSize + 0.12;
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(lidSize, 0.35, lidSize), boxMat);
    lidMesh.position.y = 0.35 / 2;
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Bow loops
    const loopGeo = new THREE.TorusGeometry(0.26, 0.065, 12, 28);
    [0.78, -0.78].forEach((rot) => {
      const l = new THREE.Mesh(loopGeo, goldMat);
      l.position.set(0, 0.42, 0);
      l.rotation.y = rot;
      lidGroup.add(l);
    });
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), goldMat);
    knot.position.set(0, 0.4, 0);
    lidGroup.add(knot);

    // Pedestal
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.3, 0.18, 36),
      new THREE.MeshStandardMaterial({ color: 0xfff0f6, roughness: 0.2, metalness: 0.3 })
    );
    platform.position.y = -0.1;
    scene.add(platform);

    // Floating Sparkles
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(75 * 3);
    for (let i = 0; i < 75 * 3; i += 3) {
      sparkPos[i] = (Math.random() - 0.5) * 6;
      sparkPos[i + 1] = Math.random() * 4;
      sparkPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkles = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xf4d58d, size: 0.08, transparent: true, opacity: 0.85 }));
    scene.add(sparkles);

    // Pointer Interaction
    let targetX = 0, targetY = 0;
    const onMove = (e) => {
      const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const cy = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const rect = el.getBoundingClientRect();
      targetY = (((cx - rect.left) / rect.width) * 2 - 1) * 0.45;
      targetX = -(((cy - rect.top) / rect.height) * 2 - 1) * 0.25;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!isOpening) {
        giftGroup.position.y = Math.sin(time * 2) * 0.08;
      }
      giftGroup.rotation.y += (targetY + Math.sin(time * 0.8) * 0.15 - giftGroup.rotation.y) * 0.05;
      giftGroup.rotation.x += (targetX - giftGroup.rotation.x) * 0.05;
      sparkles.rotation.y = time * 0.1;

      if (isOpening) {
        const state = animRef.current;
        state.progress = Math.min(1, state.progress + delta * 0.75);
        lidGroup.position.y += delta * 3.8;
        lidGroup.position.z -= delta * 2.2;
        lidGroup.rotation.x -= delta * 3.5;
        lidGroup.rotation.y += delta * 2.0;

        innerGlow.intensity = Math.min(18, innerGlow.intensity + delta * 26);
        giftGroup.scale.multiplyScalar(1 - delta * 0.18);

        if (state.progress >= 0.95 && !state.opened) {
          state.opened = true;
          if (onOpened) onOpened();
        }
      }
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el && renderer.domElement) el.removeChild(renderer.domElement);
    };
  }, [isOpening, onOpened]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}

// ==========================================
// 5. THREE.JS 3D CAKE & CANDLES SCENE
// ==========================================
function ThreeCakeScene({ isWishing, candlesBlown }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff6fa, 1.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xfff0e6, 1.8);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Pedestal Stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.2 });
    const standTop = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.15, 48), standMat);
    standTop.position.y = -0.075;
    scene.add(standTop);

    const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.65, 0.7, 32), standMat);
    standStem.position.y = -0.45;
    scene.add(standStem);

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.15, 36), standMat);
    standBase.position.y = -0.85;
    scene.add(standBase);

    // Cake Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Tier 1 (Pastel Pink Cream)
    const t1H = 0.9, t1R = 1.8;
    const t1 = new THREE.Mesh(
      new THREE.CylinderGeometry(t1R, t1R, t1H, 48),
      new THREE.MeshStandardMaterial({ color: 0xffe6f0, roughness: 0.4 })
    );
    t1.position.y = t1H / 2;
    t1.castShadow = true;
    cakeGroup.add(t1);

    // Pearl Piping on Tier 1
    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xdccbff, metalness: 0.4, roughness: 0.2 });
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), pearlMat);
      pearl.position.set(Math.cos(angle) * (t1R + 0.02), 0.08, Math.sin(angle) * (t1R + 0.02));
      cakeGroup.add(pearl);
    }

    // Tier 2 (Whipped Soft Cream)
    const t2H = 0.75, t2R = 1.25;
    const t2 = new THREE.Mesh(
      new THREE.CylinderGeometry(t2R, t2R, t2H, 48),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    t2.position.y = t1H + t2H / 2;
    t2.castShadow = true;
    cakeGroup.add(t2);

    // Strawberries on border
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xee3355, roughness: 0.3 });
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 14), strawMat);
      s.scale.set(1, 1.25, 1);
      s.position.set(Math.cos(angle) * 1.5, t1H + 0.08, Math.sin(angle) * 1.5);
      cakeGroup.add(s);
    }

    // Candles and Flames
    const candleCount = 5;
    const candleHeight = 0.65;
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xf4d58d, metalness: 0.3, roughness: 0.3 });
    const flameMeshes = [];
    const flameLights = [];

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const cx = Math.cos(angle) * 0.6;
      const cz = Math.sin(angle) * 0.6;
      const cy = t1H + t2H + candleHeight / 2;

      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, candleHeight, 16), candleMat);
      stick.position.set(cx, cy, cz);
      stick.castShadow = true;
      cakeGroup.add(stick);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 12), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
      flame.position.set(cx, cy + candleHeight / 2 + 0.16, cz);
      cakeGroup.add(flame);
      flameMeshes.push(flame);

      const fLight = new THREE.PointLight(0xff9900, 1.2, 3);
      fLight.position.set(cx, cy + candleHeight / 2 + 0.2, cz);
      cakeGroup.add(fLight);
      flameLights.push(fLight);
    }

    // Floating Balloons
    const balloonGroup = new THREE.Group();
    scene.add(balloonGroup);
    const balloonColors = [0xffd6e8, 0xdccbff, 0xf4d58d, 0x9b7bff, 0xffaacc];
    const balloons = [];
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 24, 24),
        new THREE.MeshStandardMaterial({ color: balloonColors[i % balloonColors.length], roughness: 0.2 })
      );
      b.scale.set(1, 1.3, 1);
      const angle = (i / 7) * Math.PI * 2;
      b.position.set(Math.cos(angle) * 3.4, 1.2 + Math.random() * 2, Math.sin(angle) * 3.4);
      balloonGroup.add(b);
      balloons.push({ mesh: b, initialY: b.position.y, speed: 0.8 + Math.random() * 0.6 });
    }

    let targetRotY = 0;
    const onMove = (e) => {
      const cx = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const rect = el.getBoundingClientRect();
      targetRotY = (((cx - rect.left) / rect.width) * 2 - 1) * 0.8;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      cakeGroup.rotation.y += (targetRotY + time * 0.1 - cakeGroup.rotation.y) * 0.05;

      flameMeshes.forEach((flame, idx) => {
        if (!candlesBlown) {
          flame.visible = true;
          const flicker = Math.sin(time * 18 + idx * 4) * 0.15;
          flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
          flameLights[idx].intensity = (isWishing ? 2.5 : 1.2) + flicker;
        } else {
          flame.visible = false;
          flameLights[idx].intensity = 0;
        }
      });

      ambientLight.intensity = isWishing ? 0.6 : 1.4;
      dirLight.intensity = isWishing ? 0.9 : 1.8;

      balloons.forEach((b) => {
        b.mesh.position.y = b.initialY + Math.sin(time * b.speed) * 0.25;
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el && renderer.domElement) el.removeChild(renderer.domElement);
    };
  }, [isWishing, candlesBlown]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}

// ==========================================
// 6. MAIN CONTROLLER & APPLICATION
// ==========================================
export default function App() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [stage, setStage] = useState('opening'); // 'opening' | 'celebrating'
  const [isOpeningGift, setIsOpeningGift] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [volume, setVolume] = useState(0.28);

  // Cake state
  const [isWishing, setIsWishing] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  // Gallery Lightbox
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Letter & Final Surprise
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [finalOpened, setFinalOpened] = useState(false);

  // Settings Modal
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (activePhotoIdx === null) return;
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowRight') setActivePhotoIdx((p) => (p + 1) % config.memories.length);
      if (e.key === 'ArrowLeft') setActivePhotoIdx((p) => (p - 1 + config.memories.length) % config.memories.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePhotoIdx, config.memories.length]);

  const handleOpenSurprise = () => {
    if (isOpeningGift) return;
    soundEngine.playPop();
    soundEngine.playSparkles();
    setIsOpeningGift(true);
    setShowConfetti(true);

    if (!isPlayingMusic) {
      soundEngine.startMusic(setIsPlayingMusic);
    }
  };

  const handleGiftOpened = () => {
    setTimeout(() => {
      setStage('celebrating');
      soundEngine.playSparkles();
    }, 600);
  };

  const handleMakeWish = () => {
    soundEngine.playSparkles();
    setIsWishing(true);
    setCandlesBlown(false);
  };

  const handleBlowCandles = () => {
    soundEngine.playExtinguish();
    setCandlesBlown(true);
    setIsWishing(false);
    setShowConfetti(true);
  };

  const handleRestartCelebration = () => {
    soundEngine.playSparkles();
    setFinalOpened(false);
    setCandlesBlown(false);
    setIsWishing(false);
    setIsLetterOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowConfetti(true);
  };

  const scrollTo = (id) => {
    soundEngine.playPop();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Image Upload handler for memories
  const handleImageUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const updated = [...config.memories];
      updated[index].imgUrl = url;
      setConfig({ ...config, memories: updated });
      soundEngine.playPop();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d091a] text-slate-100 font-sans selection:bg-[#ff9ecf] selection:text-[#0d091a] overflow-x-hidden">
      {/* Ambient Dream Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(155,123,255,0.22),rgba(255,214,232,0.08),rgba(13,9,26,1))] z-0" />

      {/* Confetti FX */}
      <ConfettiOverlay active={showConfetti} onFinished={() => setShowConfetti(false)} />

      {/* TOP FLOATING NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 backdrop-blur-md bg-[#0d091a]/65 border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9B7BFF] to-[#FFD6E8] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Cake className="w-5 h-5 text-[#0d091a]" />
            </div>
            <span className="font-serif tracking-wide text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] bg-clip-text text-transparent">
              {config.sisterName}’s Dream
            </span>
          </div>

          {stage === 'celebrating' && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-purple-200/80">
              <button onClick={() => scrollTo('hero')} className="hover:text-pink-300 transition-colors">Cake & Wish</button>
              <button onClick={() => scrollTo('memories')} className="hover:text-pink-300 transition-colors">Our Memories</button>
              <button onClick={() => scrollTo('letter')} className="hover:text-pink-300 transition-colors">Birthday Letter</button>
              <button onClick={() => scrollTo('surprise')} className="hover:text-pink-300 transition-colors">Final Surprise</button>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => soundEngine.toggle(setIsPlayingMusic)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/30 text-xs sm:text-sm text-pink-200 transition-all shadow-sm"
              title="Toggle Birthday Music Box"
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-pink-300 animate-pulse" /> : <VolumeX className="w-4 h-4 text-purple-400" />}
              <span className="hidden sm:inline">{isPlayingMusic ? 'Music Box' : 'Play Music'}</span>
            </button>

            <button
              onClick={() => setIsConfigOpen(true)}
              className="p-2 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/30 text-purple-200 transition-all"
              title="Customize Name, Wishes & Photos"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SCENE 1: OPENING 3D PRESENT */}
      {/* ========================================================= */}
      {stage === 'opening' && (
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8 text-center">
          <div className="max-w-2xl mx-auto mb-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/20 to-amber-500/15 border border-pink-400/30 text-xs sm:text-sm font-medium text-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              A Special Digital Birthday Gift
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] leading-tight">
              A Little Birthday Magic Just for You ✨
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 font-light max-w-lg mx-auto">
              Someone very special deserves something extraordinary... Tap the present below to reveal what’s waiting for you, {config.sisterName}.
            </p>
          </div>

          <div className="relative w-full max-w-md h-72 sm:h-96 my-2">
            <ThreeGiftScene isOpening={isOpeningGift} onOpened={handleGiftOpened} />
            <div className="absolute inset-x-12 bottom-6 h-12 bg-pink-500/25 blur-3xl -z-10 rounded-full" />
          </div>

          <div className="mt-2">
            <button
              onClick={handleOpenSurprise}
              disabled={isOpeningGift}
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base sm:text-lg font-medium text-[#0d091a] transition-all duration-300 shadow-xl ${
                isOpeningGift 
                  ? 'bg-amber-300/80 cursor-wait opacity-80' 
                  : 'bg-gradient-to-r from-[#FFD6E8] via-[#F4D58D] to-[#FF9ECF] hover:shadow-pink-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              <Gift className={`w-5 h-5 text-purple-900 ${isOpeningGift ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
              <span className="font-semibold tracking-wide">
                {isOpeningGift ? 'Opening The Magic...' : 'Open Your Birthday Surprise 🎁'}
              </span>
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 opacity-30 blur group-hover:opacity-60 transition duration-500 -z-10" />
            </button>
            <p className="text-xs text-purple-300/60 mt-3">
              (Drag or swipe to rotate the 3D gift box)
            </p>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* SCENE 2: MAIN CELEBRATION, 3D CAKE & WISH CEREMONY */}
      {/* ========================================================= */}
      {stage === 'celebrating' && (
        <div className="relative z-10 pt-20">
          
          <section id="hero" className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 max-w-6xl mx-auto text-center">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-400/40 text-xs sm:text-sm text-pink-200">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                Happy Birthday, {config.sisterName}!
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] bg-clip-text text-transparent leading-snug">
                {config.heroHeading}
              </h1>

              <p className="text-base sm:text-lg text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
                {config.heroSubtitle}
              </p>
            </div>

            {/* 3D Birthday Cake */}
            <div className="relative w-full max-w-xl h-80 sm:h-[400px] my-3">
              <ThreeCakeScene isWishing={isWishing} candlesBlown={candlesBlown} />
              <div className="absolute inset-x-20 bottom-10 h-14 bg-purple-600/20 blur-3xl -z-10 rounded-full" />
            </div>

            {/* Candle Wish Controls */}
            <div className="max-w-md w-full mx-auto space-y-4">
              {!isWishing && !candlesBlown && (
                <button
                  onClick={handleMakeWish}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9B7BFF] via-[#FF9ECF] to-[#F4D58D] text-[#0d091a] font-semibold text-base shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Sparkles className="w-5 h-5 text-purple-950" />
                  Make a Birthday Wish ✨
                </button>
              )}

              {isWishing && !candlesBlown && (
                <div className="p-5 rounded-2xl bg-purple-950/70 border border-amber-400/40 backdrop-blur-md space-y-4 shadow-xl">
                  <p className="text-amber-200 font-serif italic text-base sm:text-lg">
                    "{config.wishPrompt}"
                  </p>
                  <button
                    onClick={handleBlowCandles}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 to-pink-300 text-purple-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
                  >
                    <Flame className="w-4 h-4 text-red-500" />
                    Blow Out the Candles 💨
                  </button>
                </div>
              )}

              {candlesBlown && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-400/40 backdrop-blur-md space-y-3 shadow-xl">
                  <p className="text-pink-100 font-serif text-lg font-medium">
                    {config.wishGranted}
                  </p>
                  <button
                    onClick={() => {
                      soundEngine.playSparkles();
                      setCandlesBlown(false);
                      setIsWishing(false);
                    }}
                    className="px-5 py-2 rounded-full bg-purple-800/60 hover:bg-purple-700/80 border border-purple-400/30 text-xs sm:text-sm text-pink-200 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Light the Candles Again
                  </button>
                </div>
              )}

              {/* Navigation Jump buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm">
                <button onClick={() => scrollTo('memories')} className="px-4 py-1.5 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 transition-colors flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-pink-300" /> Our Memories
                </button>
                <button onClick={() => scrollTo('letter')} className="px-4 py-1.5 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-300" /> Birthday Letter
                </button>
                <button onClick={() => scrollTo('surprise')} className="px-4 py-1.5 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 transition-colors flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-pink-400" /> Final Surprise
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION 3: OUR MEMORIES SCRAPBOOK GALLERY */}
          {/* ========================================================= */}
          <section id="memories" className="py-20 px-4 max-w-6xl mx-auto border-t border-purple-500/20">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-900/40 border border-pink-400/30 text-xs text-pink-300">
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                Treasured Moments
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] bg-clip-text text-transparent">
                Our Little World of Memories 📸
              </h2>
              <p className="text-purple-200/80 text-sm sm:text-base">
                "Every picture holds a little piece of happiness." Captured moments with Chheng Lorng.
              </p>
            </div>

            {/* Scrapbook Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {config.memories.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative bg-[#171126] border border-purple-400/20 rounded-2xl p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-pink-500/20 hover:border-pink-400/50 flex flex-col justify-between"
                >
                  <div>
                    <div 
                      onClick={() => {
                        soundEngine.playPop();
                        setActivePhotoIdx(index);
                      }}
                      className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-purple-950/50 cursor-pointer"
                    >
                      <img
                        src={photo.imgUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-pink-200">
                        {photo.tag}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-xs text-white flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" /> View Photo
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-semibold text-base text-pink-100 group-hover:text-amber-200 transition-colors">
                          {photo.title}
                        </h3>
                        <span className="text-[10px] text-purple-300/60">{photo.date}</span>
                      </div>
                      <p className="text-xs text-purple-200/80 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  {/* Inline photo replacer button */}
                  <label className="mt-4 pt-2 border-t border-purple-500/10 flex items-center justify-center gap-1.5 text-[11px] text-purple-300/60 hover:text-pink-300 cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Change Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(index, e)} 
                    />
                  </label>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-purple-300/50 mt-8">
              Click any photo to open full-screen, or click "Change Photo" on any card to put your pictures of Chheng Lorng right in!
            </p>
          </section>

          {/* ========================================================= */}
          {/* SECTION 4: HEARTFELT BIRTHDAY LETTER */}
          {/* ========================================================= */}
          <section id="letter" className="py-20 px-4 max-w-4xl mx-auto border-t border-purple-500/20">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-400/30 text-xs text-purple-200">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                Personal Message
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] bg-clip-text text-transparent">
                {config.letter.title}
              </h2>
              <p className="text-purple-200/80 text-sm">
                Sealed with warmth, love, and birthday wishes for Chheng Lorng.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              {!isLetterOpen ? (
                <div 
                  onClick={() => {
                    soundEngine.playPop();
                    soundEngine.playSparkles();
                    setIsLetterOpen(true);
                  }}
                  className="group relative cursor-pointer bg-gradient-to-br from-[#25183d] to-[#150d26] border-2 border-purple-400/30 hover:border-pink-400/60 rounded-3xl p-8 sm:p-12 text-center shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#9B7BFF] to-[#FFD6E8] flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 group-hover:rotate-6 transition-transform">
                    <Mail className="w-10 h-10 text-[#0d091a]" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-pink-100 mb-2">
                    An Envelope For Chheng Lorng
                  </h3>
                  <p className="text-purple-200/70 text-sm max-w-md mx-auto mb-6">
                    Tap the wax seal to break open this digital envelope and read what I wrote for you.
                  </p>

                  <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F4D58D] to-[#FF9ECF] text-[#0d091a] font-semibold text-sm shadow-md group-hover:shadow-pink-500/40">
                    <Heart className="w-4 h-4 fill-current" />
                    Open My Letter
                  </button>
                </div>
              ) : (
                <div className="relative bg-[#FFF8F0] text-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl border-4 border-[#F4D58D]/60 animate-fade-in">
                  <div className="absolute top-4 left-4 text-pink-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsLetterOpen(false)}
                      className="p-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors"
                      title="Close letter"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="font-serif leading-relaxed text-sm sm:text-base space-y-4 text-slate-800 whitespace-pre-line pt-2">
                    {config.letter.body}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-300/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="italic">Written with all my heart for Chheng Lorng</span>
                    <span className="flex items-center gap-1 font-semibold text-pink-600">
                      <Heart className="w-4 h-4 fill-pink-600" /> Always Family
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================= */}
          {/* SECTION 5: FINAL SURPRISE & REPLAY */}
          {/* ========================================================= */}
          <section id="surprise" className="py-20 px-4 max-w-4xl mx-auto border-t border-purple-500/20 text-center">
            <div className="space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-400/30 text-xs text-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-300" />
                Grand Finale
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold bg-gradient-to-r from-[#FFD6E8] via-[#FFF8F0] to-[#F4D58D] bg-clip-text text-transparent">
                {config.finalSurprise.heading}
              </h2>
              <p className="text-purple-200/80 text-sm sm:text-base max-w-lg mx-auto">
                Before your special day wraps up, here is one last reminder of how much you mean to our family.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {!finalOpened ? (
                <div 
                  onClick={() => {
                    soundEngine.playPop();
                    soundEngine.playSparkles();
                    setFinalOpened(true);
                    setShowConfetti(true);
                  }}
                  className="cursor-pointer group p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#22163b] to-[#120a22] border border-amber-400/30 hover:border-pink-400/60 shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#F4D58D] to-[#FF9ECF] flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4 group-hover:rotate-12 transition-transform">
                    <Gift className="w-10 h-10 text-purple-950" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-pink-100">
                    Click to Open The Final Gift 💝
                  </h3>
                  <p className="text-xs text-purple-300/70 mt-1">
                    Prepared with warm hugs and endless gratitude for Chheng Lorng
                  </p>
                </div>
              ) : (
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-900/70 via-pink-900/40 to-amber-900/30 border-2 border-pink-400/50 shadow-2xl space-y-6 animate-fade-in backdrop-blur-md">
                  <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300">
                    <Sparkles className="w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>

                  <p className="text-lg sm:text-2xl font-serif leading-relaxed text-pink-100 font-medium">
                    "{config.finalSurprise.message}"
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleRestartCelebration}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FFD6E8] via-[#F4D58D] to-[#FF9ECF] text-[#0d091a] font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Celebrate Again 🎉
                    </button>
                    <button
                      onClick={() => setShowConfetti(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-purple-900/50 hover:bg-purple-800/60 border border-purple-400/30 text-pink-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      More Confetti!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <footer className="py-12 px-4 text-center border-t border-purple-500/20 text-xs sm:text-sm text-purple-300/60 space-y-2">
            <p>Made with all my heart for Chheng Lorng’s Birthday 🎂💖</p>
            <p className="text-[11px] text-purple-400/40">Powered by React, Three.js, Web Audio & endless sibling love.</p>
          </footer>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FULLSCREEN PHOTO LIGHTBOX */}
      {/* ========================================================= */}
      {activePhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setActivePhotoIdx(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#171126] border border-purple-400/30 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhotoIdx(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={config.memories[activePhotoIdx].imgUrl}
                alt={config.memories[activePhotoIdx].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playPop();
                  setActivePhotoIdx((prev) => (prev - 1 + config.memories.length) % config.memories.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                title="Previous photo (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playPop();
                  setActivePhotoIdx((prev) => (prev + 1) % config.memories.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                title="Next photo (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 bg-[#171126] space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-pink-100">
                  {config.memories[activePhotoIdx].title}
                </h3>
                <span className="text-xs text-purple-300">
                  {activePhotoIdx + 1} of {config.memories.length}
                </span>
              </div>
              <p className="text-sm text-purple-200/90 leading-relaxed">
                {config.memories[activePhotoIdx].caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CUSTOMIZER SETTINGS MODAL */}
      {/* ========================================================= */}
      {isConfigOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsConfigOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-[#191129] border border-purple-400/40 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-serif font-bold text-pink-100">Personalize Birthday Surprise</h3>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="p-1.5 rounded-full hover:bg-purple-800/40 text-purple-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-purple-200 font-medium mb-1">Sister's Name</label>
                <input
                  type="text"
                  value={config.sisterName}
                  onChange={(e) => setConfig({ ...config, sisterName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-400/30 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-medium mb-1">Hero Greeting Heading</label>
                <input
                  type="text"
                  value={config.heroHeading}
                  onChange={(e) => setConfig({ ...config, heroHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-400/30 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-medium mb-1">Heartfelt Letter Content</label>
                <textarea
                  rows={6}
                  value={config.letter.body}
                  onChange={(e) => setConfig({ ...config, letter: { ...config.letter, body: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-400/30 text-white focus:outline-none focus:border-pink-400 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-medium mb-1">Music Volume ({Math.round(volume * 100)}%)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsConfigOpen(false);
                }}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-amber-300 text-purple-950 font-bold hover:scale-105 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}