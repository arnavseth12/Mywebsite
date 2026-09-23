const homeSection = document.getElementById('home');
const mapSection = document.getElementById('map');
const exploreBtn = document.getElementById('explore-btn');

exploreBtn.addEventListener('click', () => {
  homeSection.classList.add('leaving');
  mapSection.classList.remove('hidden');
  mapSection.classList.add('show');

  setTimeout(() => {
    homeSection.classList.add('hidden');
  }, 700);
});

const backBtn = document.getElementById('back-btn');
const nodes = document.querySelectorAll('.node');

backBtn.addEventListener('click', () => {
  mapSection.classList.remove('show');
  homeSection.classList.remove('hidden');
  requestAnimationFrame(() => {
    homeSection.classList.remove('leaving');
  });


setTimeout(() => {
  mapSection.classList.add('hidden');
},800);
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

const emberField = document.getElementById('ember-field');

for (let i = 0; i < 20; i++) {
  const ember = document.createElement('div');
  ember.className = 'ember';

  const leftPos = Math.random() * 100;
  const duration = 6 + Math.random() * 6;
  const delay = Math.random() * 8;
  const drift = (Math.random() * 60 - 30) + 'px';

  ember.style.left = leftPos + '%';
  ember.style.animationDuration = duration + 's';
  ember.style.animationDelay = '-' + delay + 's';
  ember.style.setProperty('--drift', drift);

  emberField.appendChild(ember);
}