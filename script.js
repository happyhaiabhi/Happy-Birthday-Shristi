/* A little celebration engine for Shristi's birthday page. */
document.documentElement.classList.add('js-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- confetti ---------- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const colors = ['#ff6fae', '#ffd98a', '#cbb7ff', '#ffb38a', '#9bd8ff', '#fff8f2', '#ff9ac1'];
let particles = [];
let rafId = null;
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function burst(x, y, amount = 70, power = 1) {
  if (reduceMotion) return;
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 7) * power;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5 * power,
      size: 4 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - .5) * .28,
      drag: .985,
      gravity: .12 + Math.random() * .08,
      life: 0,
      ttl: 110 + Math.random() * 60,
      round: Math.random() > .7
    });
  }
  if (!rafId) rafId = requestAnimationFrame(animateConfetti);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles = particles.filter(p => p.life < p.ttl && p.y < canvasHeight + 40);

  particles.forEach(p => {
    p.life += 1;
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spin;
    const fade = Math.min(1, (p.ttl - p.life) / 30);
    ctx.save();
    ctx.globalAlpha = Math.max(0, fade);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    if (p.round) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .66);
    }
    ctx.restore();
  });

  if (particles.length) {
    rafId = requestAnimationFrame(animateConfetti);
  } else {
    rafId = null;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

function burstAtElement(element, amount = 70, power = 1) {
  const rect = element.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, amount, power);
}

/* ---------- hero sparkles ---------- */
const sparkles = document.getElementById('sparkles');
for (let i = 0; i < 24; i += 1) {
  const star = document.createElement('span');
  star.className = 'sparkle';
  star.textContent = Math.random() > .5 ? '✦' : '✧';
  star.style.left = `${5 + Math.random() * 90}%`;
  star.style.top = `${8 + Math.random() * 84}%`;
  star.style.setProperty('--size', `${9 + Math.random() * 15}px`);
  star.style.setProperty('--duration', `${2.5 + Math.random() * 4}s`);
  star.style.setProperty('--delay', `${-Math.random() * 5}s`);
  sparkles.appendChild(star);
}

/* ---------- scroll reveal ---------- */
const revealItems = document.querySelectorAll('.reveal');
document.querySelectorAll('.hero-content.reveal > *').forEach((child, index) => {
  child.style.setProperty('--delay', `${index * 90}ms`);
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

/* ---------- compliment generator ---------- */
const compliments = [
  'You are the human version of a sunny day. ☀️',
  'Your laugh should be on everyone’s playlist. 🎶',
  'Some people are gifts. You’re the whole wrapped box. 🎁',
  'You make “just one more minute” last all night. ✨',
  'Your heart is the good kind of contagious. 💗',
  'If kindness had a face, we think we’d know it. 😊',
  'The world makes more sense when you’re in it. 🌍',
  'You’re proof that good vibes are a real superpower. 🦸'
];
const complimentText = document.getElementById('compliment-text');
document.getElementById('compliment-button').addEventListener('click', () => {
  let next = compliments[Math.floor(Math.random() * compliments.length)];
  if (next === complimentText.textContent) {
    next = compliments[(compliments.indexOf(next) + 1) % compliments.length];
  }
  complimentText.textContent = next;
  burstAtElement(complimentText, 24, .55);
});

/* ---------- envelope ---------- */
const envelope = document.getElementById('envelope');
const envelopeHint = envelope.querySelector('.envelope-hint');
envelope.addEventListener('click', () => {
  const isOpen = envelope.classList.toggle('open');
  envelope.setAttribute('aria-expanded', String(isOpen));
  envelopeHint.textContent = isOpen ? 'tap to close' : 'tap to open';
  if (isOpen) burstAtElement(envelope, 55, .75);
});

/* ---------- birthday candles ---------- */
const candles = Array.from(document.querySelectorAll('.candle'));
const wishCount = document.getElementById('wish-count');
const wishTitle = document.getElementById('wish-title');
const wishCopy = document.getElementById('wish-copy');
const wishReveal = document.getElementById('wish-reveal');
const resetCandles = document.getElementById('reset-candles');

function blownCount() {
  return candles.filter(candle => candle.classList.contains('out')).length;
}

function updateWishStatus() {
  const left = candles.length - blownCount();
  if (left === candles.length) {
    wishCount.textContent = `${left} candles waiting`;
    wishTitle.textContent = 'What’s your wish?';
    wishCopy.textContent = 'Close your eyes, think of something wonderful, then tap a flame to blow it out.';
  } else if (left > 0) {
    wishCount.textContent = `${left} ${left === 1 ? 'candle' : 'candles'} left`;
    wishTitle.textContent = 'Keep going…';
    wishCopy.textContent = 'Nice! One wish closer. Tap the remaining flames to finish the job.';
  } else {
    wishCount.textContent = 'wish complete';
    wishTitle.textContent = 'You did it!';
    wishCopy.textContent = 'Whatever you wished for, we hope it finds its way to you.';
    wishReveal.hidden = false;
    burstAtElement(document.querySelector('.cake'), 140, 1.25);
    setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * .35, 90, 1.1), 350);
  }
}

function blowOut(candle) {
  if (candle.classList.contains('out')) return;
  candle.classList.add('out');
  candle.setAttribute('aria-label', candle.getAttribute('aria-label').replace('Blow out', 'Relight'));
  burstAtElement(candle, 22, .5);
  updateWishStatus();
}

candles.forEach(candle => {
  candle.addEventListener('click', () => blowOut(candle));
  candle.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      blowOut(candle);
    }
  });
});

resetCandles.addEventListener('click', () => {
  candles.forEach(candle => {
    candle.classList.remove('out');
    candle.setAttribute('aria-label', candle.getAttribute('aria-label').replace('Relight', 'Blow out'));
  });
  wishReveal.hidden = true;
  updateWishStatus();
});

/* ---------- birthday tune (public-domain melody, synthesized) ---------- */
const musicToggle = document.getElementById('music-toggle');
const musicLabel = musicToggle.querySelector('.music-label');
let audioContext = null;
let playing = false;
let melodyTimeout = null;
const activeOscillators = [];

const noteFrequencies = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
};
const melody = [
  ['G4', .5], ['G4', .5], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', .5], ['G4', .5], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', .5], ['G4', .5], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', .5], ['F5', .5], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2]
];

function playTone(frequency, start, duration) {
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(.075, start + .04);
  gain.gain.setValueAtTime(.06, start + duration * .6);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);

  [0, 4].forEach((detune, index) => {
    const osc = audioContext.createOscillator();
    osc.type = index === 0 ? 'sine' : 'triangle';
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    osc.connect(gain);
    osc.start(start);
    osc.stop(start + duration + .05);
    activeOscillators.push(osc);
    osc.onended = () => {
      osc.disconnect();
      const i = activeOscillators.indexOf(osc);
      if (i > -1) activeOscillators.splice(i, 1);
    };
  });
}

function stopMusic() {
  playing = false;
  clearTimeout(melodyTimeout);
  const now = audioContext ? audioContext.currentTime : 0;
  activeOscillators.forEach(osc => {
    try { osc.stop(now); } catch (e) { /* already stopped */ }
  });
  activeOscillators.length = 0;
  musicToggle.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = 'Play music';
}

function startMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    musicLabel.textContent = 'No audio support';
    return;
  }
  audioContext = audioContext || new AudioCtx();
  audioContext.resume();
  playing = true;
  musicToggle.setAttribute('aria-pressed', 'true');
  musicLabel.textContent = 'Pause music';

  const beat = .36;
  let time = audioContext.currentTime + .08;
  melody.forEach(([note, beats]) => {
    playTone(noteFrequencies[note], time, beats * beat * .92);
    time += beats * beat;
  });
  melodyTimeout = setTimeout(stopMusic, (time - audioContext.currentTime) * 1000 + 250);
}

musicToggle.addEventListener('click', () => {
  if (playing) stopMusic();
  else startMusic();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && playing) stopMusic();
});

/* ---------- finale ---------- */
document.getElementById('celebrate-button').addEventListener('click', () => {
  burst(window.innerWidth / 2, window.innerHeight * .7, 130, 1.25);
  setTimeout(() => burst(window.innerWidth * .2, window.innerHeight * .4, 70, 1), 250);
  setTimeout(() => burst(window.innerWidth * .8, window.innerHeight * .4, 70, 1), 450);
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ---------- a warm welcome ---------- */
setTimeout(() => burst(window.innerWidth / 2, window.innerHeight * .38, 90, .85), 700);
