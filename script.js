const homeSection = document.getElementById('home');
const mapSection = document.getElementById('map');
const exploreBtn = document.getElementById('explore-btn');

exploreBtn.addEventListener('click', () => {
  homeSection.classList.add('hidden');
  mapSection.classList.remove('hidden');
});

const backBtn = document.getElementById('back-btn');
const nodes = document.querySelectorAll('.node');

backBtn.addEventListener('click', () => {
  mapSection.classList.add('hidden');
  homeSection.classList.remove('hidden');
});

nodes.forEach((node) => {
  node.addEventListener('click', () => {
    console.log('Navigating to:', node.dataset.page);
  });
});