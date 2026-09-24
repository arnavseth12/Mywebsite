const homeSection = document.getElementById('home');
const mapSection = document.getElementById('map');
const exploreBtn = document.getElementById('explore-btn');
const backBtn = document.getElementById('back-btn');
const nodes = document.querySelectorAll('.node');

exploreBtn.addEventListener('click', () => {
  homeSection.classList.add('leaving');
  mapSection.classList.remove('hidden');
  requestAnimationFrame(() => {
    mapSection.classList.add('show');
  });

  setTimeout(() => {
    homeSection.classList.add('hidden');
  }, 700);
});

backBtn.addEventListener('click', () => {
  mapSection.classList.remove('show');
  homeSection.classList.remove('hidden');
  requestAnimationFrame(() => {
    homeSection.classList.remove('leaving');
  });

  setTimeout(() => {
    mapSection.classList.add('hidden');
  }, 800);
});

nodes.forEach((node) => {
  node.addEventListener('click', () => {
    const page = node.dataset.page;

    if (page === 'home') {
      backBtn.click();
      return;
    }

    window.location.href = page + '.html';
  });
});

const leafField = document.getElementById('leaf-field');
const leafEmojis = ['🍂', '🍁', '🍃'];

for (let i = 0; i < 18; i++) {
  const leaf = document.createElement('span');
  leaf.className = 'leaf';
  leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];

  const leftPos = Math.random() * 100;
  const duration = 8 + Math.random() * 8;
  const delay = Math.random() * 10;
  const drift = (Math.random() * 80 - 40) + 'px';

  leaf.style.left = leftPos + '%';
  leaf.style.animationDuration = duration + 's';
  leaf.style.animationDelay = '-' + delay + 's';
  leaf.style.setProperty('--drift', drift);

  leafField.appendChild(leaf);
}

const words = ['Developer', 'Designer', 'Creator'];
const typedTextEl = document.getElementById('typed-text');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

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

const easterTrigger = document.getElementById('easter-trigger');
const gameModal = document.getElementById('game-modal');
const gameClose = document.getElementById('game-close');
const gameArena = document.getElementById('game-arena');
const gameScoreEl = document.getElementById('game-score');
const gameTimerEl = document.getElementById('game-timer');
const gameStart = document.getElementById('game-start');
const gameStatus = document.getElementById('game-status');

let score = 0;
let timeLeft = 15;
let spawnInterval = null;
let countdownInterval = null;

easterTrigger.addEventListener('click', () => {
  gameModal.classList.remove('hidden');
});

gameClose.addEventListener('click', () => {
  gameModal.classList.add('hidden');
});

gameStart.addEventListener('click', startGame);

function startGame() {
  score = 0;
  timeLeft = 15;
  gameScoreEl.textContent = 'score';
  gameTimerEl.textContent = 'Time: 15';
  gameStatus.textContent = 'Click before they vanish!';
  gameStart.disabled = true;
  gameArena.querySelectorAll('.firefly').forEach((f) => f.remove());

  spawnInterval = setInterval(spawnFirefly, 700);
  countdownInterval = setInterval(() => {
    timeLeft--;
    gameTimerEl.textContent = 'Time: ' + timeLeft;
    if (timeLeft === 0) endGame();
  }, 1000);
}

function spawnFirefly() {
  const firefly = document.createElement('button');
  firefly.className = 'firefly';
  firefly.textContent = '✨';

  const maxX = gameArena.clientWidth -26;
  const maxY = gameArena.clientHeight -26;
  firefly.style.left = Math.random() * maxX + 'px';
  firefly.style.top = Math.random() * maxY + 'px';

  firefly.addEventListener('click', () => {
    score++;
    gameScoreEl.textContent = 'Score: ' + score;
    firefly.remove();
  });

  gameArena.appendChild(firefly);
  setTimeout(() => firefly.remove(), 1200);

}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(countdownInterval);
  gameArena.querySelectorAll('.firefly').forEach((f) => f.remove());
  gameStart.disabled = false;
  gameStatus.textContent = 'Game Over! Final Score: ' + score;

}

