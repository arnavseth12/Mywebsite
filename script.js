/* ==========================================================
   Arnav Seth — portfolio
   Vanilla JS, no libraries. Sections are in page order.
   ========================================================== */

/* ---------- CONFIG ---------- */
const GITHUB_USERNAME = 'arnavseth12';
const REPO_URL = 'https://github.com/arnavseth12/Mywebsite';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpbkdbv';
const EMAIL = 'arnavseth26@gmail.com';

const THEMES = {
  amber: '#ffb000',
  green: '#7ad97a',
  blue: '#5ab0ff',
  pink: '#ff6fae',
  red: '#ff5a4f'
};

const $ = (id) => document.getElementById(id);
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const safeStore = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
};

/* ---------- TOASTS ---------- */
const notifContainer = $('notif-container');
function toast(text, ms = 3200) {
  const el = document.createElement('div');
  el.className = 'notif';
  el.textContent = text;
  notifContainer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('notif-show'));
  setTimeout(() => {
    el.classList.remove('notif-show');
    setTimeout(() => el.remove(), 300);
  }, ms);
}

/* ---------- ACCENT THEME (saved) ---------- */
function getAccent() {
  return getComputedStyle(root).getPropertyValue('--accent').trim() || THEMES.amber;
}
let accentColor = getAccent();
function applyTheme(name) {
  root.style.setProperty('--accent', THEMES[name]);
  safeStore.set('accent', THEMES[name]);
  accentColor = THEMES[name];
}

/* ---------- SCROLL REVEAL (set up first so content never stays hidden) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

/* ---------- BOOT SEQUENCE (first visit per session, skippable) ---------- */
const bootScreen = $('boot-screen');
const bootTextEl = $('boot-text');
const bootLines = [
  'initializing system...',
  'loading modules [ok]',
  'mounting /portfolio...',
  'user: arnav_seth',
  'status: available for hire',
  '',
  'welcome.'
];
let bootDone = false;
let bootTimer = null;

function finishBoot() {
  if (bootDone) return;
  bootDone = true;
  clearTimeout(bootTimer);
  try { sessionStorage.setItem('booted', '1'); } catch (e) {}
  bootScreen.classList.add('hidden');
  setTimeout(() => bootScreen.remove(), 450);
  startHero();
  setTimeout(() => {
    if (!safeStore.get('hint-seen')) {
      toast('tip: press ` to open the terminal, 1–5 to jump between sections', 5000);
      safeStore.set('hint-seen', '1');
    }
  }, 7000);
}

function runBoot() {
  let line = 0, ch = 0;
  function step() {
    if (bootDone) return;
    if (line >= bootLines.length) { bootTimer = setTimeout(finishBoot, 400); return; }
    const current = bootLines[line];
    if (ch <= current.length) {
      bootTextEl.textContent = bootLines.slice(0, line).join('\n') + '\n' + current.slice(0, ch);
      ch++;
      bootTimer = setTimeout(step, 14);
    } else {
      line++; ch = 0;
      bootTimer = setTimeout(step, 120);
    }
  }
  step();
  ['keydown', 'click', 'touchstart'].forEach((evt) => window.addEventListener(evt, finishBoot, { once: true }));
}

/* ---------- HERO (tagline + code window type once, then stay) ---------- */
const typedTextEl = $('typed-text');
const codeTyperEl = $('code-typer');
const heroEl = $('hero');
const taglineFull = typedTextEl.textContent.trim();
const codeFull = codeTyperEl.textContent;
let heroStarted = false;

function startHero() {
  if (heroStarted) return;
  heroStarted = true;
  heroEl.classList.add('start');

  if (reducedMotion) {
    typedTextEl.textContent = taglineFull;
    return;
  }
  typedTextEl.textContent = '';
  codeTyperEl.textContent = '';
  let i = 0;
  (function typeTagline() {
    typedTextEl.textContent = taglineFull.slice(0, ++i);
    if (i < taglineFull.length) setTimeout(typeTagline, 32);
    else setTimeout(typeCode, 300);
  })();
}

function typeCode() {
  codeTyperEl.classList.add('typing');
  let i = 0;
  (function tick() {
    codeTyperEl.textContent = codeFull.slice(0, ++i);
    if (i < codeFull.length) setTimeout(tick, codeFull[i - 1] === '\n' ? 140 : 18);
    else codeTyperEl.classList.remove('typing');
  })();
}

if (reducedMotion || root.classList.contains('skip-boot')) {
  bootDone = true;
  bootScreen.remove();
  startHero();
} else {
  runBoot();
}

/* ---------- TIME-BASED GREETING ---------- */
const hour = new Date().getHours();
const greeting = hour < 12 ? 'good morning' : hour < 18 ? 'good afternoon' : 'good evening';
$('greeting-line').textContent = `// ${greeting}`;

/* ---------- BACKGROUND RAIN (mouse-reactive) ---------- */
const canvas = $('matrix-canvas');
const ctx = canvas.getContext('2d');
const matrixChars = '01<>[]{}/\\;=';
const fontSize = 16;
let mouseX = -9999, mouseY = -9999;
let columns = 0;
let drops = [];
let effectsOn = safeStore.get('effects') !== 'off' && !reducedMotion;

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = new Array(columns).fill(1);
}
sizeCanvas();

function setEffects(on) {
  effectsOn = on;
  canvas.classList.toggle('off', !on);
  safeStore.set('effects', on ? 'on' : 'off');
}
canvas.classList.toggle('off', !effectsOn);

function drawMatrix() {
  if (!effectsOn || document.hidden) return;
  ctx.fillStyle = 'rgba(22, 21, 19, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const xPos = i * fontSize;
    const nearMouse = Math.abs(xPos - mouseX) < 120;
    ctx.fillStyle = nearMouse ? '#fff4cc' : accentColor;
    ctx.fillText(text, xPos, drops[i] * fontSize);
    drops[i] += nearMouse ? 1.6 : 1;
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
  }
}
setInterval(drawMatrix, 50);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(sizeCanvas, 150);
});

/* ---------- CUSTOM CURSOR + TERMINAL RAIN TRAIL ---------- */
const cursorDot = $('cursor-dot');
const cursorRing = $('cursor-ring');
let ringX = 0, ringY = 0;
let lastTrail = 0;
const trailChars = '01<>{}/;';

if (finePointer) {
  root.classList.add('js-cursor');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';

    const now = performance.now();
    if (effectsOn && now - lastTrail > 55) {
      lastTrail = now;
      spawnTrail(mouseX, mouseY);
    }
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    cursorRing.classList.toggle('hot', !!e.target.closest('a, button, input, textarea, .ctx-item, #term-close'));
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();
}

function spawnTrail(x, y) {
  const el = document.createElement('span');
  el.className = 'ascii-trail';
  el.textContent = trailChars[Math.floor(Math.random() * trailChars.length)];
  el.style.left = (x + (Math.random() * 16 - 8)) + 'px';
  el.style.top = (y + 8) + 'px';
  document.body.appendChild(el);
  const anim = el.animate(
    [{ transform: 'translateY(0)', opacity: 0.7 }, { transform: 'translateY(40px)', opacity: 0 }],
    { duration: 700, easing: 'ease-out' }
  );
  anim.onfinish = () => el.remove();
}

/* ---------- KEY CLICK SOUND (synthesized) ---------- */
let audioCtx = null;
function playKeyClick() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200 + Math.random() * 400;
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

/* ---------- IDLE SCREENSAVER ---------- */
const idleBouncer = $('idle-bouncer');
let lastActivityTime = Date.now();
let idleActive = false;
let idleAnimFrame = null;
let bouncerX = 100, bouncerY = 100, bouncerVX = 2.4, bouncerVY = 1.8;

['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) => {
  window.addEventListener(evt, () => {
    lastActivityTime = Date.now();
    if (idleActive) exitIdleMode();
  }, { passive: true });
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
if (!reducedMotion) {
  setInterval(() => {
    if (!idleActive && !document.hidden && Date.now() - lastActivityTime > 30000) enterIdleMode();
  }, 1000);
}

/* ---------- SKILL BARS ---------- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.querySelector('.skill-fill').style.width = bar.dataset.percent + '%';
    const status = bar.querySelector('.skill-status');
    setTimeout(() => { status.textContent = 'done ✓'; }, 1200);
    skillObserver.unobserve(bar);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-bar').forEach((bar) => skillObserver.observe(bar));

/* ---------- SCROLLSPY NAV ---------- */
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === id));
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
document.querySelectorAll('#home, #work, #profile, #services, #contact').forEach((s) => spyObserver.observe(s));

/* ---------- SCROLL EFFECTS (progress bar, HUD %, horizontal work track) ---------- */
const scrollProgressFill = $('scroll-progress-fill');
const statProgressEl = $('stat-progress');
const horizontalWrap = $('work');
const horizontalTrack = $('horizontal-track');
const horizontalSticky = document.querySelector('.horizontal-sticky');

function getMaxTranslate() {
  const sidePad = parseFloat(getComputedStyle(horizontalSticky).paddingLeft) || 0;
  return horizontalTrack.scrollWidth + sidePad - horizontalSticky.clientWidth;
}
function setupHorizontalHeight() {
  horizontalWrap.style.height = (window.innerHeight + Math.max(getMaxTranslate(), 0)) + 'px';
}
function updateHorizontalScroll() {
  const scrollable = horizontalWrap.offsetHeight - window.innerHeight;
  let progress = scrollable > 0 ? (window.scrollY - horizontalWrap.offsetTop) / scrollable : 0;
  progress = Math.min(Math.max(progress, 0), 1);
  horizontalTrack.style.transform = `translateX(-${progress * Math.max(getMaxTranslate(), 0)}px)`;
}
function updateScrollEffects() {
  const scrollable = document.body.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0;
  scrollProgressFill.style.width = percent + '%';
  statProgressEl.textContent = percent + '%';
  updateHorizontalScroll();
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => { updateScrollEffects(); scrollTicking = false; });
}, { passive: true });

function refreshLayout() {
  setupHorizontalHeight();
  updateScrollEffects();
}
refreshLayout();
window.addEventListener('resize', refreshLayout);
window.addEventListener('load', refreshLayout);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshLayout);

/* ---------- FLIP CARDS ---------- */
document.querySelectorAll('.flip-trigger').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.closest('.flip-inner').classList.toggle('flipped');
  });
});

/* ---------- DEMO LINKS (toast, opens straight away so popup blockers stay quiet) ---------- */
document.querySelectorAll('.demo-link').forEach((link) => {
  link.addEventListener('click', () => toast(`> launching ${link.dataset.name}...`, 1800));
});

/* ---------- QUOTE BUTTONS ---------- */
document.querySelectorAll('.quote-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const message = $('message');
    message.value = `I'm interested in a quote for: ${btn.dataset.service}\n\n`;
    $('contact').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => message.focus({ preventScroll: true }), 600);
  });
});

/* ---------- CONTACT FORM ---------- */
const form = $('contact-form');
const submitBtn = $('submit-btn');
const statusEl = $('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '[ sending... ]';
  statusEl.textContent = '';
  statusEl.className = '';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
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
    statusEl.textContent = `[ error ] network failure — check your connection or email ${EMAIL}.`;
    statusEl.className = 'error';
  }
  submitBtn.disabled = false;
  submitBtn.textContent = '[ send_message ]';
});

/* ---------- GITHUB: CONTRIBUTION GRAPH + RECENT REPOS ---------- */
function relativeTime(iso) {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const units = [['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
  for (const [label, size] of units) {
    if (seconds >= size) return Math.floor(seconds / size) + label + ' ago';
  }
  return 'just now';
}

async function loadContributions() {
  const box = $('github-chart');
  const totalEl = $('gh-total');
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const days = data.contributions;
    if (!Array.isArray(days) || !days.length) throw new Error('no data');

    const grid = document.createElement('div');
    grid.className = 'gh-grid';
    grid.setAttribute('role', 'img');

    const leading = new Date(days[0].date + 'T00:00:00').getDay();
    for (let i = 0; i < leading; i++) {
      const blank = document.createElement('span');
      blank.className = 'gh-cell blank';
      grid.appendChild(blank);
    }

    let total = 0;
    days.forEach((day) => {
      total += day.count;
      const cell = document.createElement('span');
      cell.className = 'gh-cell';
      cell.dataset.l = String(day.level);
      const when = new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      cell.title = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${when}`;
      grid.appendChild(cell);
    });

    grid.setAttribute('aria-label', `${total.toLocaleString()} GitHub contributions in the last year`);
    box.appendChild(grid);
    totalEl.textContent = `${total.toLocaleString()} contributions in the last year`;
    box.scrollLeft = box.scrollWidth;
  } catch (err) {
    totalEl.textContent = 'contribution graph unavailable right now';
    const msg = document.createElement('p');
    msg.className = 'gh-empty';
    msg.textContent = 'See github.com/' + GITHUB_USERNAME + ' for the live graph.';
    box.appendChild(msg);
  }
}

async function loadRepos() {
  const list = $('repo-list');
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5&type=owner`);
    if (!res.ok) throw new Error('fetch failed');
    const repos = await res.json();
    if (!Array.isArray(repos) || !repos.length) throw new Error('no repos');

    repos.forEach((repo) => {
      const row = document.createElement('a');
      row.className = 'repo-row';
      row.href = repo.html_url;
      row.target = '_blank';
      row.rel = 'noopener';

      const name = document.createElement('span');
      name.className = 'repo-name';
      name.textContent = repo.name;

      const desc = document.createElement('span');
      desc.className = 'repo-desc';
      desc.textContent = repo.description || repo.language || '';

      const time = document.createElement('span');
      time.className = 'repo-time';
      time.textContent = relativeTime(repo.pushed_at);

      row.append(name, desc, time);
      list.appendChild(row);
    });
  } catch (err) {
    list.remove();
  }
}
loadContributions();
loadRepos();

/* ---------- RIGHT-CLICK MENU ---------- */
const contextMenu = $('context-menu');

window.addEventListener('contextmenu', (e) => {
  if (e.target.closest('input, textarea')) return; // keep the native menu for text fields
  e.preventDefault();
  contextMenu.classList.remove('hidden');
  const x = Math.min(e.clientX, window.innerWidth - contextMenu.offsetWidth - 8);
  const y = Math.min(e.clientY, window.innerHeight - contextMenu.offsetHeight - 8);
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
});
window.addEventListener('click', () => contextMenu.classList.add('hidden'));

contextMenu.querySelectorAll('.ctx-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = item.dataset.action;
    if (action === 'copy-link') {
      navigator.clipboard.writeText(window.location.href).then(() => toast('link copied'), () => toast('could not copy link'));
    } else if (action === 'view-source') {
      window.open(REPO_URL, '_blank', 'noopener');
    } else if (action === 'about') {
      toast('A terminal-style portfolio by Arnav Seth. HTML, CSS and vanilla JS.', 5000);
    }
    contextMenu.classList.add('hidden');
  });
});

/* ---------- DEV MODE PANEL ---------- */
const devModeToggle = $('dev-mode-toggle');
const devPanel = $('dev-panel');
devModeToggle.addEventListener('click', () => {
  devPanel.classList.toggle('hidden');
  devModeToggle.setAttribute('aria-expanded', String(!devPanel.classList.contains('hidden')));
});

/* ---------- TERMINAL WIDGET ---------- */
const termToggle = $('term-toggle');
const termWidget = $('term-widget');
const termClose = $('term-close');
const termOutput = $('term-output');
const termInput = $('term-input');

function printLine(text, cls) {
  const line = document.createElement('div');
  if (cls) line.className = cls;
  line.textContent = text;
  termOutput.appendChild(line);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function setTerm(open) {
  termWidget.classList.toggle('hidden', !open);
  termToggle.setAttribute('aria-expanded', String(open));
  if (open) termInput.focus({ preventScroll: true });
}

termToggle.addEventListener('click', () => setTerm(termWidget.classList.contains('hidden')));
termClose.addEventListener('click', () => setTerm(false));

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
  const maxX = window.innerWidth - 80;
  const maxY = window.innerHeight - 48;
  termWidget.style.left = Math.min(Math.max(e.clientX - termDragOffsetX, -300), maxX) + 'px';
  termWidget.style.top = Math.min(Math.max(e.clientY - termDragOffsetY, 0), maxY) + 'px';
});
window.addEventListener('mouseup', () => { isDraggingTerm = false; });

/* ---------- TERMINAL COMMANDS ---------- */
let snakeUnlocked = false;
const FILES = ['about.txt', 'resume.pdf', 'secrets.txt'];

function scrollToSection(id) {
  $(id).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}
function downloadResume() {
  const link = document.createElement('a');
  link.href = 'resume.pdf';
  link.download = '';
  link.click();
}

const commands = {
  help: () => {
    printLine('available commands:', 'line-amber');
    printLine('  help, about, whoami, skills, projects, services, contact');
    printLine('  ls, cd <dir>, cat <file>, resume, email, github');
    printLine('  theme <color>, matrix <on|off>, reset, hire, banner');
    printLine('  stats, specs, now, date, echo, history, sudo, play, clear');
  },
  about: () => printLine('student, developer, designer and creator. into web development, cybersecurity, robotics and creative technology.'),
  whoami: () => printLine('guest — but you could be a client. try "contact".', 'line-dim'),
  skills: () => {
    printLine('JavaScript    ####################  90%');
    printLine('HTML / CSS    ####################  100%');
    printLine('Python        ##############        70%');
  },
  projects: () => {
    printLine('scrolling to [ 002 ] work.');
    scrollToSection('work');
  },
  services: () => {
    printLine('site building, brand redesign. scrolling you there now.');
    scrollToSection('services');
  },
  contact: () => {
    printLine('scrolling to contact form.');
    scrollToSection('contact');
  },
  email: () => {
    printLine(EMAIL, 'line-amber');
    window.location.href = 'mailto:' + EMAIL;
  },
  github: () => {
    printLine('github.com/' + GITHUB_USERNAME, 'line-amber');
    window.open('https://github.com/' + GITHUB_USERNAME, '_blank', 'noopener');
  },
  resume: () => {
    printLine('downloading resume.pdf...', 'line-dim');
    downloadResume();
  },
  sudo: (args) => {
    if (args.join(' ').toLowerCase() === 'make me a sandwich') {
      printLine('permission granted.', 'line-amber');
      printLine('  ,-----------.');
      printLine(' (  ~~~~~~~~~  )', 'line-dim');
      printLine('  `-----------\'', 'line-dim');
      printLine('here you go.', 'line-dim');
    } else {
      printLine('permission denied: nice try.', 'line-error');
    }
  },
  clear: () => { termOutput.innerHTML = ''; },
  play: () => {
    printLine('launching debug_hunt.exe...', 'line-amber');
    openBugGame();
  },
  snake: () => {
    if (!snakeUnlocked) {
      printLine('command not found: snake (try "help")', 'line-error');
      return;
    }
    printLine('launching snake.exe...', 'line-amber');
    openSnakeGame();
  },
  ls: () => printLine('projects/    ' + FILES.join('    '), 'line-dim'),
  cd: (args) => {
    const target = (args[0] || '').toLowerCase();
    if (target === 'projects' || target === 'projects/') {
      printLine('entered ~/projects — scrolling there now.');
      scrollToSection('work');
    } else if (!target) {
      printLine('usage: cd <directory>', 'line-error');
    } else {
      printLine(`cd: no such directory: ${args[0]}`, 'line-error');
    }
  },
  cat: (args) => {
    const file = (args[0] || '').toLowerCase();
    if (file === 'secrets.txt') {
      printLine('you found a secret. mention "cat secrets.txt" in your message for a discount.', 'line-amber');
    } else if (file === 'about.txt') {
      commands.about();
    } else if (file === 'resume.pdf') {
      commands.resume();
    } else if (!file) {
      printLine('usage: cat <file>', 'line-error');
    } else {
      printLine(`cat: no such file: ${args[0]}`, 'line-error');
    }
  },
  theme: (args) => {
    const choice = (args[0] || '').toLowerCase();
    if (Object.hasOwn(THEMES, choice)) {
      applyTheme(choice);
      printLine(`theme set to ${choice}. saved for next time.`, 'line-amber');
    } else {
      printLine('usage: theme [' + Object.keys(THEMES).join('|') + ']', 'line-error');
    }
  },
  matrix: (args) => {
    const choice = (args[0] || '').toLowerCase();
    if (choice === 'on' || choice === 'off') {
      setEffects(choice === 'on');
      printLine(`background rain and cursor trail: ${choice}.`, 'line-amber');
    } else {
      printLine(`rain is ${effectsOn ? 'on' : 'off'}. usage: matrix [on|off]`, 'line-dim');
    }
  },
  reset: () => {
    applyTheme('amber');
    setEffects(!reducedMotion);
    printLine('theme and effects back to defaults.', 'line-dim');
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
        $('message').value = "I'd like to hire you for a project.\n\n";
        scrollToSection('contact');
      }
    }, 200);
  },
  banner: () => {
    printLine(
`╔══════════════════════════╗
║        ARNAV SETH        ║
║  developer / designer /  ║
║        creator           ║
╚══════════════════════════╝`, 'line-amber');
  },
  specs: () => {
    printLine('stack: HTML5 / CSS3 / vanilla JS', 'line-dim');
    printLine('fonts: Geist, JetBrains Mono', 'line-dim');
    printLine('forms: Formspree', 'line-dim');
    printLine('analytics: Google Analytics (GA4)', 'line-dim');
    printLine('hosting: GitHub Pages', 'line-dim');
  },
  now: () => printLine('currently: sharpening JS fundamentals and shipping this site.', 'line-amber'),
  date: () => printLine(new Date().toString(), 'line-dim'),
  echo: (args) => printLine(args.join(' ')),
  history: () => {
    if (!commandHistory.length) { printLine('no history yet.', 'line-dim'); return; }
    commandHistory.forEach((entry, i) => printLine(`  ${i + 1}  ${entry}`, 'line-dim'));
  },
  stats: async () => {
    printLine('fetching github stats...', 'line-dim');
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      printLine(`public repos: ${data.public_repos}`, 'line-amber');
      printLine(`followers: ${data.followers}`, 'line-amber');
      printLine(`account created: ${data.created_at.split('T')[0]}`, 'line-amber');
    } catch (err) {
      printLine('[ error ] could not reach the github api. try again in a minute.', 'line-error');
    }
  }
};

const completions = {
  cat: FILES,
  theme: Object.keys(THEMES),
  matrix: ['on', 'off'],
  cd: ['projects/']
};

let commandHistory = [];
let historyIndex = -1;

termInput.addEventListener('keydown', (e) => {
  if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) playKeyClick();

  if (e.key === 'Enter') {
    const raw = termInput.value.trim();
    termInput.value = '';
    if (!raw) return;

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    printLine('> ' + raw);
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (Object.hasOwn(commands, cmd)) {
      commands[cmd](args);
    } else {
      printLine(`command not found: ${cmd} (try "help")`, 'line-error');
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const parts = termInput.value.split(/\s+/);
    if (parts.length === 1 && parts[0]) {
      const matches = Object.keys(commands).filter((c) => c.startsWith(parts[0].toLowerCase()));
      if (matches.length === 1) termInput.value = matches[0] + ' ';
      else if (matches.length > 1) printLine(matches.join('  '), 'line-dim');
    } else if (parts.length === 2) {
      const options = completions[parts[0].toLowerCase()] || [];
      const matches = options.filter((o) => o.startsWith(parts[1].toLowerCase()));
      if (matches.length === 1) termInput.value = parts[0] + ' ' + matches[0];
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

/* ---------- KONAMI CODE ---------- */
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
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
  setTerm(true);

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
    }, 1000);
    printLine('░░░ YOU DID IT AGAIN ░░░', 'line-amber');
    printLine('there is nothing left to unlock. just enjoy the light show.', 'line-dim');
  }
}

/* ---------- MINI-GAME: DEBUG HUNT ---------- */
const gameModal = $('game-modal');
const gameArena = $('game-arena');
const gameScoreEl = $('game-score');
const gameTimerEl = $('game-timer');
const gameStartBtn = $('game-start');
const gameStatusEl = $('game-status');

let bugScore = 0, bugTimeLeft = 15;
let bugSpawnInterval = null, bugCountdownInterval = null;

function openBugGame() { gameModal.classList.remove('hidden'); }

function stopBugGame() {
  clearInterval(bugSpawnInterval);
  clearInterval(bugCountdownInterval);
  gameArena.querySelectorAll('.bug').forEach((b) => b.remove());
  gameStartBtn.disabled = false;
}
function closeBugGame() {
  stopBugGame();
  gameModal.classList.add('hidden');
}
$('game-close').addEventListener('click', closeBugGame);
gameStartBtn.addEventListener('click', startBugGame);

function startBugGame() {
  stopBugGame();
  bugScore = 0;
  bugTimeLeft = 15;
  gameScoreEl.textContent = 'score: 0';
  gameTimerEl.textContent = 'time: 15';
  gameStatusEl.textContent = 'Click the bugs before they escape!';
  gameStartBtn.disabled = true;

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
  bug.setAttribute('aria-label', 'bug');
  bug.innerHTML = '<i class="fa-solid fa-bug"></i>';
  bug.style.left = Math.random() * (gameArena.clientWidth - 32) + 'px';
  bug.style.top = Math.random() * (gameArena.clientHeight - 32) + 'px';
  bug.addEventListener('click', () => {
    bugScore++;
    gameScoreEl.textContent = 'score: ' + bugScore;
    bug.remove();
  });
  gameArena.appendChild(bug);
  setTimeout(() => bug.remove(), 1200);
}

function endBugGame() {
  stopBugGame();
  gameStatusEl.textContent = 'Session terminated. Bugs fixed: ' + bugScore;
}

/* ---------- MINI-GAME: SNAKE (unlocked via Konami) ---------- */
const snakeModal = $('snake-modal');
const snakeCanvas = $('snake-canvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeScoreEl = $('snake-score');
const snakeStartBtn = $('snake-start');
const snakeStatusEl = $('snake-status');

const SNAKE_CELL = 16;
const SNAKE_GRID = 20;
let snakeBody = [], snakeDir = { x: 1, y: 0 }, pendingDir = { x: 1, y: 0 };
let snakeFood = { x: 15, y: 10 }, snakeScore = 0, snakeLoopInterval = null, snakeActive = false;

function resetSnake() {
  snakeBody = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  snakeDir = { x: 1, y: 0 };
  pendingDir = { x: 1, y: 0 };
  snakeScore = 0;
  snakeScoreEl.textContent = '0';
  placeSnakeFood();
  drawSnake();
}
function openSnakeGame() {
  snakeModal.classList.remove('hidden');
  resetSnake();
}
function closeSnakeGame() {
  clearInterval(snakeLoopInterval);
  snakeActive = false;
  snakeModal.classList.add('hidden');
}
$('snake-close').addEventListener('click', closeSnakeGame);
snakeStartBtn.addEventListener('click', startSnakeGame);

function startSnakeGame() {
  resetSnake();
  snakeStatusEl.textContent = 'Arrow keys to move. Go!';
  snakeActive = true;
  clearInterval(snakeLoopInterval);
  snakeLoopInterval = setInterval(snakeTick, 120);
}

function placeSnakeFood() {
  let spot;
  do {
    spot = { x: Math.floor(Math.random() * SNAKE_GRID), y: Math.floor(Math.random() * SNAKE_GRID) };
  } while (snakeBody.some((seg) => seg.x === spot.x && seg.y === spot.y));
  snakeFood = spot;
}

function snakeTick() {
  snakeDir = pendingDir;
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
  snakeCtx.fillStyle = '#e5604f';
  snakeCtx.fillRect(snakeFood.x * SNAKE_CELL, snakeFood.y * SNAKE_CELL, SNAKE_CELL, SNAKE_CELL);
  snakeCtx.fillStyle = accentColor;
  snakeBody.forEach((seg) => {
    snakeCtx.fillRect(seg.x * SNAKE_CELL, seg.y * SNAKE_CELL, SNAKE_CELL - 1, SNAKE_CELL - 1);
  });
}

const arrowDirs = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

window.addEventListener('keydown', (e) => {
  if (snakeModal.classList.contains('hidden') || !Object.hasOwn(arrowDirs, e.key)) return;
  e.preventDefault(); // keep the page from scrolling while playing
  if (!snakeActive) return;
  const next = arrowDirs[e.key];
  // can't reverse straight into yourself
  if (next.x + snakeDir.x !== 0 || next.y + snakeDir.y !== 0) pendingDir = next;
});

/* ---------- ADMIN LINK EASTER EGG ---------- */
$('admin-link').addEventListener('click', (e) => {
  e.preventDefault();
  setTerm(true);
  printLine('> access /admin', 'line-dim');
  printLine('access denied — nice try.', 'line-error');
});

/* ---------- KEYBOARD SHORTCUTS ---------- */
const shortcutSections = ['home', 'work', 'profile', 'services', 'contact'];
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    contextMenu.classList.add('hidden');
    devPanel.classList.add('hidden');
    devModeToggle.setAttribute('aria-expanded', 'false');
    closeBugGame();
    closeSnakeGame();
    setTerm(false);
    return;
  }

  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (e.key === '`') {
    e.preventDefault();
    setTerm(termWidget.classList.contains('hidden'));
    return;
  }
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 5) scrollToSection(shortcutSections[num - 1]);
});

/* ---------- STATUS HUD (real values: time on page, scroll %) ---------- */
const uptimeEl = $('stat-uptime');
let uptimeSeconds = 0;
setInterval(() => {
  uptimeSeconds++;
  const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(uptimeSeconds % 60).padStart(2, '0');
  uptimeEl.textContent = `${h}:${m}:${s}`;
}, 1000);

/* ---------- TAB TITLE ON BLUR ---------- */
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? 'come back_' : originalTitle;
});

/* ---------- CONSOLE EASTER EGG ---------- */
console.log('%cnice, you opened the console.', 'color:#ffb000;font-family:monospace');
console.log('source: ' + REPO_URL + ' — email me: ' + EMAIL);