/* ---------- CONFIG ---------- */
const GITHUB_USERNAME = 'arnavseth12';

/* ---------- CRT POWER-ON → BOOT SEQUENCE ---------- */
const crtOn = document.getElementById('crt-on');
const bootScreen = document.getElementById('boot-screen');
const bootTextEl = document.getElementById('boot-text');

const bootLines = [
  'initializing system...',
  'loading modules [ok]',
  'mounting /portfolio...',
  'user: arnav_seth',
  'status: available for hire',
  '',
  'welcome.'
];
let bootLineIndex = 0;
let bootCharIndex = 0;

function bootType() {
  if (bootLineIndex >= bootLines.length) {
    setTimeout(() => bootScreen.classList.add('hidden'), 500);
    return;
  }
  const currentLine = bootLines[bootLineIndex];
  if (bootCharIndex <= currentLine.length) {
    bootTextEl.textContent = bootLines.slice(0, bootLineIndex).join('\n') + '\n' + currentLine.slice(0, bootCharIndex);
    bootCharIndex++;
    setTimeout(bootType, 20);
  } else {
    bootLineIndex++;
    bootCharIndex = 0;
    setTimeout(bootType, 200);
  }
}

setTimeout(() => crtOn.classList.add('expand'), 400);
setTimeout(() => {
  crtOn.classList.add('hide');
  setTimeout(() => {
    crtOn.remove();
    bootType();
  }, 250);
}, 850);

/* ---------- MATRIX RAIN (mouse-reactive) ---------- */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = '01アイウエオカキクケコ<>[]{}/\\';
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = new Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const amberColor = getComputedStyle(document.documentElement).getPropertyValue('--amber').trim() || '#ffb000';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const xPos = i * fontSize;
    const isNearMouse = Math.abs(xPos - mouseX) < 120;

    ctx.fillStyle = isNearMouse ? '#fff4cc' : amberColor;
    ctx.fillText(text, xPos, drops[i] * fontSize);

    drops[i] += isNearMouse ? 1.6 : 1;
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
  }
}
setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = new Array(columns).fill(1);
});

/* ---------- CUSTOM CURSOR ---------- */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ---------- MECHANICAL KEYBOARD CLICK (synthesized, no audio file needed) ---------- */
let audioCtx = null;
function playKeyClick() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = 1200 + Math.random() * 400;
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

/* ---------- IDLE SCREENSAVER MODE ---------- */
const idleBouncer = document.getElementById('idle-bouncer');
let lastActivityTime = Date.now();
let idleActive = false;
let idleAnimFrame = null;
let bouncerX = 100, bouncerY = 100, bouncerVX = 2.4, bouncerVY = 1.8;

['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) => {
  window.addEventListener(evt, () => {
    lastActivityTime = Date.now();
    if (idleActive) exitIdleMode();
  });
});

function enterIdleMode() {
  idleActive = true;
  canvas.classList.add('idle-intense');
  idleBouncer.classList.add('active');
  bouncerX = Math.random() * (window.innerWidth - 40);
  bouncerY = Math.random() * (window.innerHeight - 40);
  bounceLoop();
}

function exitIdleMode() {
  idleActive = false;
  canvas.classList.remove('idle-intense');
  idleBouncer.classList.remove('active');
  if (idleAnimFrame) cancelAnimationFrame(idleAnimFrame);
}

function bounceLoop() {
  if (!idleActive) return;
  bouncerX += bouncerVX;
  bouncerY += bouncerVY;
  if (bouncerX <= 0 || bouncerX >= window.innerWidth - 30) bouncerVX *= -1;
  if (bouncerY <= 0 || bouncerY >= window.innerHeight - 30) bouncerVY *= -1;
  idleBouncer.style.left = bouncerX + 'px';
  idleBouncer.style.top = bouncerY + 'px';
  idleAnimFrame = requestAnimationFrame(bounceLoop);
}

setInterval(() => {
  if (!idleActive && Date.now() - lastActivityTime > 30000) enterIdleMode();
}, 1000);

/* ---------- FAKE SYSTEM NOTIFICATIONS ---------- */
const notifContainer = document.getElementById('notif-container');
const fakeLogs = [
  '[sys] compiling portfolio.js... done',
  '[net] new visitor detected',
  '[cache] assets preloaded',
  '[sys] all systems nominal',
  '[net] ping from unknown host',
  '[sys] coffee levels: sufficient'
];

function spawnNotification() {
  const text = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
  const notif = document.createElement('div');
  notif.className = 'notif';
  notif.textContent = text;
  notifContainer.appendChild(notif);

  requestAnimationFrame(() => notif.classList.add('notif-show'));

  setTimeout(() => {
    notif.classList.remove('notif-show');
    setTimeout(() => notif.remove(), 400);
  }, 4000);

  scheduleNextNotification();
}

function scheduleNextNotification() {
  setTimeout(spawnNotification, 15000 + Math.random() * 15000);
}
scheduleNextNotification();

/* ---------- CLICK PARTICLES ---------- */
window.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = getComputedStyle(document.documentElement).getPropertyValue('--amber').trim();
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '95';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 8;
    const distance = 30 + Math.random() * 20;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    particle.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${endX}px, ${endY}px)`, opacity: 0 }
    ], { duration: 500, easing: 'ease-out' });

    setTimeout(() => particle.remove(), 500);
  }
});

/* ---------- MAGNETIC BUTTONS ---------- */
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

/* ---------- TEXT SCRAMBLE ON SCROLL ---------- */
function scrambleText(el) {
  const original = el.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  let iteration = 0;

  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, index) => {
      if (index < iteration) return original[index];
      if (char === ' ') return ' ';
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');

    if (iteration >= original.length) clearInterval(interval);
    iteration += 0.6;
  }, 30);
}

const scrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      scrambleText(entry.target);
      scrambleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-label').forEach((el) => scrambleObserver.observe(el));

/* ---------- TYPEWRITER (tagline) ---------- */
const words = ['Developer', 'Designer', 'Creator'];
const typedTextEl = document.getElementById('typed-text');
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const currentWord = words[wordIndex];
  if (!deleting) {
    typedTextEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    typedTextEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 110);
}
typeLoop();

/* ---------- TIME-BASED GREETING ---------- */
const greetingEl = document.getElementById('greeting-line');
const hour = new Date().getHours();
let greeting = 'good evening';
if (hour < 12) greeting = 'good morning';
else if (hour < 18) greeting = 'good afternoon';
greetingEl.textContent = `// ${greeting}`;

/* ---------- CODE-WINDOW TYPING LOOP ---------- */
const codeTyperEl = document.getElementById('code-typer');
const codeLines = [
  'const developer = {',
  '  name: "Arnav Seth",',
  '  skills: ["JS", "CSS", "HTML"],',
  '  passion: true',
  '};',
  '',
  'developer.buildCoolStuff();'
];
let codeLineIndex = 0, codeCharIndex = 0;

function codeTypeLoop() {
  if (codeLineIndex >= codeLines.length) {
    setTimeout(() => {
      codeTyperEl.textContent = '';
      codeLineIndex = 0;
      codeCharIndex = 0;
      codeTypeLoop();
    }, 2000);
    return;
  }
  const currentLine = codeLines[codeLineIndex];
  if (codeCharIndex <= currentLine.length) {
    codeTyperEl.textContent = codeLines.slice(0, codeLineIndex).join('\n') + '\n' + currentLine.slice(0, codeCharIndex);
    codeCharIndex++;
    setTimeout(codeTypeLoop, 35);
  } else {
    codeLineIndex++;
    codeCharIndex = 0;
    setTimeout(codeTypeLoop, 150);
  }
}
codeTypeLoop();

/* ---------- SCROLL REVEAL ---------- */
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealItems.forEach((item) => revealObserver.observe(item));

/* ---------- SKILL BARS ---------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const percent = bar.dataset.percent;
      const fill = bar.querySelector('.skill-fill');
      const status = bar.querySelector('.skill-status');
      fill.style.width = percent + '%';
      setTimeout(() => { status.textContent = 'done ✓'; }, 1400);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-bar').forEach((bar) => skillObserver.observe(bar));

/* ---------- SCROLLSPY NAV + WIPE TRANSITION ---------- */
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('#home, #work, #profile, #services, #contact');
const wipeOverlay = document.getElementById('wipe-overlay');
let lastActiveSection = null;

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === id));

      if (id !== lastActiveSection) {
        lastActiveSection = id;
        wipeOverlay.classList.remove('wipe-active');
        void wipeOverlay.offsetWidth;
        wipeOverlay.classList.add('wipe-active');
      }
    }
  });
}, { threshold: 0.5 });
sections.forEach((section) => spyObserver.observe(section));

/* ---------- SCROLL PROGRESS BAR + COMPLETION % + PARALLAX ---------- */
const scrollProgressFill = document.getElementById('scroll-progress-fill');
const statProgressEl = document.getElementById('stat-progress');
const parallaxLabels = document.querySelectorAll('.section-label');

function updateScrollEffects() {
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const percent = scrollableHeight > 0 ? Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100)) : 0;
  scrollProgressFill.style.width = percent + '%';
  statProgressEl.textContent = percent + '%';

  parallaxLabels.forEach((el) => {
    const rect = el.getBoundingClientRect();
    el.style.transform = `translateY(${rect.top * 0.08}px)`;
  });
}
window.addEventListener('scroll', updateScrollEffects);
updateScrollEffects();

/* ---------- QUOTE BUTTONS ---------- */
document.querySelectorAll('.quote-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const service = btn.dataset.service;
    document.getElementById('message').value = `I'm interested in a quote for: ${service}\n\n`;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---------- CONTACT FORM ---------- */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('form-status');
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpbkdbv';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'sending...';
  statusEl.textContent = '';
  statusEl.className = '';

  const formData = new FormData(form);
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    if (response.ok) {
      statusEl.textContent = "[ ok ] message sent — I'll get back to you soon.";
      statusEl.className = 'success';
      form.reset();
    } else {
      const reason = data.errors ? data.errors.map((err) => err.message).join(', ') : 'unknown error';
      statusEl.textContent = '[ error ] ' + reason;
      statusEl.className = 'error';
    }
  } catch (error) {
    statusEl.textContent = '[ error ] network failure — check your connection.';
    statusEl.className = 'error';
  }
  submitBtn.disabled = false;
  submitBtn.textContent = '[ send_message ]';
});

/* ---------- HORIZONTAL WORK SCROLL ---------- */
const horizontalWrap = document.getElementById('work');
const horizontalTrack = document.getElementById('horizontal-track');
const horizontalSticky = document.querySelector('.horizontal-sticky');

function getMaxTranslate() {
  const sidePad = parseFloat(getComputedStyle(horizontalSticky).paddingLeft) || 0;
  return horizontalTrack.scrollWidth + sidePad - horizontalSticky.clientWidth;
}

function setupHorizontalHeight() {
  const maxTranslate = getMaxTranslate();
  horizontalWrap.style.height = (window.innerHeight + Math.max(maxTranslate, 0)) + 'px';
}

function updateHorizontalScroll() {
  const wrapTop = horizontalWrap.offsetTop;
  const wrapHeight = horizontalWrap.offsetHeight;
  const scrollableDistance = wrapHeight - window.innerHeight;
  let progress = scrollableDistance > 0 ? (window.scrollY - wrapTop) / scrollableDistance : 0;
  progress = Math.min(Math.max(progress, 0), 1);
  const maxTranslate = getMaxTranslate();
  horizontalTrack.style.transform = `translateX(-${progress * maxTranslate}px)`;
}

setupHorizontalHeight();
updateHorizontalScroll();
window.addEventListener('scroll', updateHorizontalScroll);
window.addEventListener('resize', () => {
  setupHorizontalHeight();
  updateHorizontalScroll();
});

/* ---------- FLIP CARDS (click-to-flip) ---------- */
document.querySelectorAll('.flip-trigger').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const flipInner = btn.closest('.flip-inner');
    flipInner.classList.toggle('flipped');
  });
});

/* ---------- RUN DEMO (compile toast before opening link) ---------- */
document.querySelectorAll('.demo-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const realUrl = link.dataset.href;
    const toast = document.createElement('div');
    toast.className = 'compile-toast';
    toast.textContent = '> compiling...';
    document.body.appendChild(toast);

    setTimeout(() => { toast.textContent = '> compiling... done.'; }, 500);
    setTimeout(() => { toast.textContent = '> compiling... done.\n> launching preview...'; }, 900);
    setTimeout(() => {
      toast.remove();
      window.open(realUrl, '_blank', 'noopener');
    }, 1400);
  });
});

/* ---------- FAVICON BLINK ---------- */
const faviconEl = document.getElementById('favicon');
const faviconOn = faviconEl.href;
const faviconOff = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%230a0a0a'/%3E%3C/svg%3E";
let faviconState = true;
setInterval(() => {
  faviconState = !faviconState;
  faviconEl.href = faviconState ? faviconOn : faviconOff;
}, 600);

/* ---------- CUSTOM RIGHT-CLICK MENU ---------- */
const contextMenu = document.getElementById('context-menu');

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.style.left = e.clientX + 'px';
  contextMenu.style.top = e.clientY + 'px';
  contextMenu.classList.remove('hidden');
});

window.addEventListener('click', () => contextMenu.classList.add('hidden'));

contextMenu.querySelectorAll('.ctx-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = item.dataset.action;
    if (action === 'copy-link') {
      navigator.clipboard.writeText(window.location.href);
    } else if (action === 'view-source') {
      window.open('https://github.com/arnavseth12/Mywebsite', '_blank', 'noopener');
    } else if (action === 'about') {
      alert('A pixel-terminal portfolio built by Arnav Seth — HTML, CSS, and vanilla JS.');
    }
    contextMenu.classList.add('hidden');
  });
});

/* ---------- DEV MODE TOGGLE ---------- */
const devModeToggle = document.getElementById('dev-mode-toggle');
const devPanel = document.getElementById('dev-panel');
devModeToggle.addEventListener('click', () => {
  devPanel.classList.toggle('hidden');
});

/* ---------- KEYBOARD SHORTCUTS (1-5 jump to section) ---------- */
const shortcutSections = ['home', 'work', 'profile', 'services', 'contact'];
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 5) {
    document.getElementById(shortcutSections[num - 1]).scrollIntoView({ behavior: 'smooth' });
  }
});

/* ---------- GITHUB CONTRIBUTION CHART + COMMIT TICKER ---------- */
const githubChartContainer = document.getElementById('github-chart');
const chartImg = document.createElement('img');
chartImg.src = `https://ghchart.rshah.org/ffb000/${arnavseth12}`;
chartImg.alt = 'GitHub contribution graph';
githubChartContainer.appendChild(chartImg);

async function loadCommitTicker() {
  const track = document.getElementById('commit-ticker-track');
  try {
    const res = await fetch(`https://api.github.com/users/${arnavseth12}/events/public`);
    if (!res.ok) throw new Error('fetch failed');
    const events = await res.json();
    const pushEvents = events.filter((ev) => ev.type === 'PushEvent').slice(0, 6);

    if (pushEvents.length === 0) {
      track.textContent = 'no recent public commits found';
      return;
    }

    const items = [];
    pushEvents.forEach((ev) => {
      ev.payload.commits.forEach((commit) => {
        items.push(`<span>${ev.repo.name}</span> — ${commit.message.split('\n')[0]}`);
      });
    });

    track.innerHTML = items.join('&nbsp;&nbsp;•&nbsp;&nbsp;') + '&nbsp;&nbsp;•&nbsp;&nbsp;' + items.join('&nbsp;&nbsp;•&nbsp;&nbsp;');
  } catch (err) {
    track.textContent = 'could not load recent commits';
  }
}
loadCommitTicker();

/* ---------- TERMINAL WIDGET (toggle, drag, output, keyboard click sound) ---------- */
const termToggle = document.getElementById('term-toggle');
const termWidget = document.getElementById('term-widget');
const termClose = document.getElementById('term-close');
const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');

function printLine(text, cls) {
  const line = document.createElement('div');
  if (cls) line.className = cls;
  line.textContent = text;
  termOutput.appendChild(line);
  termOutput.scrollTop = termOutput.scrollHeight;
}

termToggle.addEventListener('click', () => {
  termWidget.classList.toggle('hidden');
  if (!termWidget.classList.contains('hidden')) termInput.focus();
});
termClose.addEventListener('click', () => termWidget.classList.add('hidden'));

termInput.addEventListener('keypress', () => playKeyClick());

const termBarHandle = termWidget.querySelector('.term-bar-mini');
let isDraggingTerm = false;
let termDragOffsetX = 0, termDragOffsetY = 0;

termBarHandle.addEventListener('mousedown', (e) => {
  if (e.target === termClose) return;
  isDraggingTerm = true;
  const rect = termWidget.getBoundingClientRect();
  termDragOffsetX = e.clientX - rect.left;
  termDragOffsetY = e.clientY - rect.top;
  termWidget.style.right = 'auto';
  termWidget.style.bottom = 'auto';
  termWidget.style.left = rect.left + 'px';
  termWidget.style.top = rect.top + 'px';
});

window.addEventListener('mousemove', (e) => {
  if (!isDraggingTerm) return;
  termWidget.style.left = (e.clientX - termDragOffsetX) + 'px';
  termWidget.style.top = (e.clientY - termDragOffsetY) + 'px';
});

window.addEventListener('mouseup', () => { isDraggingTerm = false; });

/* ---------- TERMINAL COMMANDS ---------- */
let snakeUnlocked = false;

const commands = {
  help: () => {
    printLine('available commands:', 'line-amber');
    printLine('  help, about, projects, services, contact, whoami');
    printLine('  ls, cd <dir>, cat <file>, theme <color>');
    printLine('  hire, banner, stats, specs, now, sudo, play, clear');
  },
  about: () => printLine('a short bio about who you are goes here.'),
  projects: () => {
    printLine('scroll to [ 002 ] work section for full list.');
    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
  },
  services: () => {
    printLine('site building, brand redesign. scrolling you there now.');
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
  },
  contact: () => {
    printLine('scrolling to contact form.');
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  },
  whoami: () => printLine('guest — but you could be a client. try "contact".', 'line-dim'),
  sudo: (args) => {
    if (args.join(' ') === 'make me a sandwich') {
      printLine('permission granted.', 'line-amber');
      printLine('   🥪');
      printLine('  (  )', 'line-dim');
      printLine('here you go.', 'line-dim');
    } else {
      printLine('permission denied: nice try.', 'line-error');
    }
  },
  clear: () => { termOutput.innerHTML = ''; },
  play: () => {
    printLine('launching debug_hunt.exe...', 'line-amber');
    document.getElementById('game-modal').classList.remove('hidden');
  },
  snake: () => {
    if (!snakeUnlocked) {
      printLine('command not found: snake (try "help")', 'line-error');
      return;
    }
    printLine('launching snake.exe...', 'line-amber');
    openSnakeGame();
  },
  ls: () => {
    printLine('projects/    resume.pdf    secrets.txt    about.txt', 'line-dim');
  },
  cd: (args) => {
    const target = args[0];
    if (target === 'projects' || target === 'projects/') {
      printLine('entered ~/projects — scrolling there now.');
      document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
    } else if (!target) {
      printLine('usage: cd <directory>', 'line-error');
    } else {
      printLine(`cd: no such directory: ${target}`, 'line-error');
    }
  },
  cat: (args) => {
    const file = args[0];
    if (file === 'secrets.txt') {
      printLine('you found a secret. mention "cat secrets.txt" in your message for a discount.', 'line-amber');
    } else if (file === 'about.txt') {
      printLine('a short bio about who you are goes here.');
    } else if (file === 'resume.pdf') {
      printLine('downloading resume.pdf...', 'line-dim');
      const link = document.createElement('a');
      link.href = 'resume.pdf';
      link.download = '';
      link.click();
    } else if (!file) {
      printLine('usage: cat <file>', 'line-error');
    } else {
      printLine(`cat: no such file: ${file}`, 'line-error');
    }
  },
  theme: (args) => {
    const colorMap = {
      amber: ['#ffb000', '#a86f00'],
      green: ['#39ff14', '#1f8c0a'],
      blue: ['#3fa9ff', '#1f5c8c'],
      pink: ['#ff4fa3', '#8c1f5c'],
      red: ['#ff4136', '#8c1f1a']
    };
    const choice = args[0];
    if (choice && colorMap[choice]) {
      document.documentElement.style.setProperty('--amber', colorMap[choice][0]);
      document.documentElement.style.setProperty('--amber-dim', colorMap[choice][1]);
      printLine(`theme set to ${choice}.`, 'line-amber');
    } else {
      printLine('usage: theme [amber|green|blue|pink|red]', 'line-error');
    }
  },
  hire: () => {
    const progressLine = document.createElement('div');
    progressLine.className = 'line-amber';
    termOutput.appendChild(progressLine);
    let progress = 0;
    const hireInterval = setInterval(() => {
      progress += 20;
      const filled = Math.round(progress / 10);
      progressLine.textContent = 'generating proposal... [' + '#'.repeat(filled) + '-'.repeat(10 - filled) + '] ' + progress + '%';
      termOutput.scrollTop = termOutput.scrollHeight;
      if (progress >= 100) {
        clearInterval(hireInterval);
        printLine('proposal ready. redirecting to contact form...', 'line-dim');
        document.getElementById('message').value = "I'd like to hire you for a project.\n\n";
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  },
  banner: () => {
    const art =
`╔══════════════════════════╗
║        ARNAV SETH        ║
║  developer / designer /  ║
║        creator           ║
╚══════════════════════════╝`;
    printLine(art, 'line-amber');
  },
  specs: () => {
    printLine('stack: HTML5 / CSS3 / vanilla JS', 'line-dim');
    printLine('fonts: JetBrains Mono', 'line-dim');
    printLine('forms: Formspree', 'line-dim');
    printLine('analytics: Google Analytics (GA4)', 'line-dim');
    printLine('hosting: TBD', 'line-dim');
  },
  now: () => {
    printLine('currently: sharpening JS fundamentals and shipping this site.', 'line-amber');
  },
  stats: async () => {
    printLine('fetching github stats...', 'line-dim');
    try {
      const res = await fetch(`https://api.github.com/users/${arnavseth12}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      printLine(`public repos: ${data.public_repos}`, 'line-amber');
      printLine(`followers: ${data.followers}`, 'line-amber');
      printLine(`account created: ${data.created_at.split('T')[0]}`, 'line-amber');
    } catch (err) {
      printLine('[ error ] could not reach github api. check the username in script.js.', 'line-error');
    }
  }
};

let commandHistory = [];
let historyIndex = -1;

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const raw = termInput.value.trim();
    termInput.value = '';
    if (!raw) return;

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    printLine('> ' + raw);
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).map((a) => a.toLowerCase());

    if (commands[cmd]) {
      commands[cmd](args);
    } else {
      printLine(`command not found: ${cmd} (try "help")`, 'line-error');
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      termInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      termInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      termInput.value = '';
    }
  }
});

printLine("type 'help' to see available commands.", 'line-dim');

/* ---------- KONAMI CODE (with x2 escalation) ---------- */
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiProgress = 0;
let konamiTriggerCount = 0;

window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === konamiSequence[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === konamiSequence.length) {
      konamiProgress = 0;
      triggerKonami();
    }
  } else {
    konamiProgress = (key === konamiSequence[0]) ? 1 : 0;
  }
});

function triggerKonami() {
  konamiTriggerCount++;
  termWidget.classList.remove('hidden');

  if (konamiTriggerCount === 1) {
    document.body.classList.add('konami-flash');
    setTimeout(() => document.body.classList.remove('konami-flash'), 400);
    snakeUnlocked = true;
    printLine('░░░ SECRET UNLOCKED ░░░', 'line-amber');
    printLine('you found the konami code. respect.', 'line-dim');
    printLine('type "snake" to play a hidden game.', 'line-dim');
  } else {
    document.body.classList.add('konami-flash-big');
    canvas.classList.add('idle-intense');
    setTimeout(() => {
      document.body.classList.remove('konami-flash-big');
      canvas.classList.remove('idle-intense');
    }, 1200);
    printLine('░░░ YOU DID IT AGAIN ░░░', 'line-amber');
    printLine('there is nothing left to unlock. just enjoy the light show.', 'line-dim');
  }
}

/* ---------- MINI-GAME: DEBUG HUNT ---------- */
const gameModal = document.getElementById('game-modal');
const gameCloseBtn = document.getElementById('game-close');
const gameArena = document.getElementById('game-arena');
const gameScoreEl = document.getElementById('game-score');
const gameTimerEl = document.getElementById('game-timer');
const gameStartBtn = document.getElementById('game-start');
const gameStatusEl = document.getElementById('game-status');

let bugScore = 0, bugTimeLeft = 15;
let bugSpawnInterval = null, bugCountdownInterval = null;

gameCloseBtn.addEventListener('click', () => {
  gameModal.classList.add('hidden');
  clearInterval(bugSpawnInterval);
  clearInterval(bugCountdownInterval);
});

gameStartBtn.addEventListener('click', startBugGame);

function startBugGame() {
  bugScore = 0;
  bugTimeLeft = 15;
  gameScoreEl.textContent = 'score: 0';
  gameTimerEl.textContent = 'time: 15';
  gameStatusEl.textContent = 'Click the bugs before they escape!';
  gameStartBtn.disabled = true;
  gameArena.querySelectorAll('.bug').forEach((b) => b.remove());

  bugSpawnInterval = setInterval(spawnBug, 700);
  bugCountdownInterval = setInterval(() => {
    bugTimeLeft--;
    gameTimerEl.textContent = 'time: ' + bugTimeLeft;
    if (bugTimeLeft <= 0) endBugGame();
  }, 1000);
}

function spawnBug() {
  const bug = document.createElement('button');
  bug.className = 'bug';
  bug.textContent = '🐛';

  const maxX = gameArena.clientWidth - 26;
  const maxY = gameArena.clientHeight - 26;
  bug.style.left = Math.random() * maxX + 'px';
  bug.style.top = Math.random() * maxY + 'px';

  bug.addEventListener('click', () => {
    bugScore++;
    gameScoreEl.textContent = 'score: ' + bugScore;
    bug.remove();
  });

  gameArena.appendChild(bug);
  setTimeout(() => bug.remove(), 1200);
}

function endBugGame() {
  clearInterval(bugSpawnInterval);
  clearInterval(bugCountdownInterval);
  gameArena.querySelectorAll('.bug').forEach((b) => b.remove());
  gameStartBtn.disabled = false;
  gameStatusEl.textContent = 'Session terminated. Bugs fixed: ' + bugScore;
}

/* ---------- MINI-GAME: SNAKE (unlocked via Konami) ---------- */
const snakeModal = document.getElementById('snake-modal');
const snakeClose = document.getElementById('snake-close');
const snakeCanvas = document.getElementById('snake-canvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeScoreEl = document.getElementById('snake-score');
const snakeStartBtn = document.getElementById('snake-start');
const snakeStatusEl = document.getElementById('snake-status');

const SNAKE_CELL = 16;
const SNAKE_GRID = 20;
let snakeBody, snakeDir, snakeFood, snakeScore, snakeLoopInterval, snakeActive;

function openSnakeGame() {
  snakeModal.classList.remove('hidden');
}
snakeClose.addEventListener('click', () => {
  snakeModal.classList.add('hidden');
  clearInterval(snakeLoopInterval);
  snakeActive = false;
});
snakeStartBtn.addEventListener('click', startSnakeGame);

function startSnakeGame() {
  snakeBody = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  snakeDir = { x: 1, y: 0 };
  snakeScore = 0;
  snakeScoreEl.textContent = '0';
  snakeStatusEl.textContent = 'Arrow keys to move. Go!';
  snakeActive = true;
  placeSnakeFood();
  clearInterval(snakeLoopInterval);
  snakeLoopInterval = setInterval(snakeTick, 120);
}

function placeSnakeFood() {
  snakeFood = {
    x: Math.floor(Math.random() * SNAKE_GRID),
    y: Math.floor(Math.random() * SNAKE_GRID)
  };
}

function snakeTick() {
  const head = { x: snakeBody[0].x + snakeDir.x, y: snakeBody[0].y + snakeDir.y };

  const hitWall = head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID;
  const hitSelf = snakeBody.some((seg) => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(snakeLoopInterval);
    snakeActive = false;
    snakeStatusEl.textContent = 'Game over. Final score: ' + snakeScore;
    return;
  }

  snakeBody.unshift(head);

  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore++;
    snakeScoreEl.textContent = snakeScore;
    placeSnakeFood();
  } else {
    snakeBody.pop();
  }

  drawSnake();
}

function drawSnake() {
  snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  snakeCtx.fillStyle = '#e0605a';
  snakeCtx.fillRect(snakeFood.x * SNAKE_CELL, snakeFood.y * SNAKE_CELL, SNAKE_CELL, SNAKE_CELL);
  snakeCtx.fillStyle = '#ffb000';
  snakeBody.forEach((seg) => {
    snakeCtx.fillRect(seg.x * SNAKE_CELL, seg.y * SNAKE_CELL, SNAKE_CELL - 1, SNAKE_CELL - 1);
  });
}

window.addEventListener('keydown', (e) => {
  if (!snakeActive) return;
  if (e.key === 'ArrowUp' && snakeDir.y === 0) snakeDir = { x: 0, y: -1 };
  else if (e.key === 'ArrowDown' && snakeDir.y === 0) snakeDir = { x: 0, y: 1 };
  else if (e.key === 'ArrowLeft' && snakeDir.x === 0) snakeDir = { x: -1, y: 0 };
  else if (e.key === 'ArrowRight' && snakeDir.x === 0) snakeDir = { x: 1, y: 0 };
});

/* ---------- ADMIN LINK EASTER EGG ---------- */
document.getElementById('admin-link').addEventListener('click', (e) => {
  e.preventDefault();
  termWidget.classList.remove('hidden');
  printLine('> access /admin', 'line-dim');
  printLine('access denied — nice try.', 'line-error');
});

/* ---------- STATS HUD (uptime / ping / fake loc) ---------- */
const uptimeEl = document.getElementById('stat-uptime');
const pingEl = document.getElementById('stat-ping');
const locEl = document.getElementById('stat-loc');
let uptimeSeconds = 0;
let locCount = 2450;

setInterval(() => {
  uptimeSeconds++;
  const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(uptimeSeconds % 60).padStart(2, '0');
  uptimeEl.textContent = `${h}:${m}:${s}`;
}, 1000);

setInterval(() => {
  pingEl.textContent = (8 + Math.floor(Math.random() * 12)) + 'ms';
}, 2000);

setInterval(() => {
  locCount += Math.floor(Math.random() * 3);
  locEl.textContent = locCount.toLocaleString();
}, 4000);

/* ---------- TAB TITLE ON BLUR ---------- */
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'come back! 🥺' : originalTitle;
});