let currentIndex = 0;
let games = [];

fetch('/art/art.json')
  .then(response => response.json())
  .then(data => {
    games = data.filter(game => !game.hidden);
    const carousel = document.getElementById('carousel');

    games.forEach((game, index) => {
      const card = createGameCard(game, index);
      carousel.appendChild(card);
    });

    updateCarousel();
  });

function createGameCard(game, index) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.setAttribute('data-index', index);
  card.onclick = () => selectGame(index);

  const bannerCard = document.createElement('div');
  bannerCard.className = 'banner-card';

  const coverArt = document.createElement('img');
  coverArt.className = 'banner-image';
  coverArt.src = `art/${game['project-id']}/cover-art.png`;
  coverArt.alt = game['project-title'];

  bannerCard.appendChild(coverArt);

  // Add sidebar overlay
  const sidebar = document.createElement('img');
  sidebar.className = 'overlay-logo';
  sidebar.src = '_main/images/cover-sidebar.png';
  bannerCard.appendChild(sidebar);

  // Add age rating
  const ageRating = document.createElement('img');
  ageRating.className = 'overlay-logo';
  ageRating.src = `_main/images/cover-age-${game['age-range']}.png`;
  bannerCard.appendChild(ageRating);

  // Add supported devices
  const deviceMap = {
    'keyboard': 'keyboard',
    'controller': 'controller',
    'mobile': 'mobile',
    'vr': 'vr'
  };

  Object.keys(game['devices-supported']).forEach(device => {
    if (game['devices-supported'][device] && deviceMap[device]) {
      const deviceIcon = document.createElement('img');
      deviceIcon.className = 'overlay-logo';
      deviceIcon.src = `_main/images/cover-device-${deviceMap[device]}.png`;
      bannerCard.appendChild(deviceIcon);
    }
  });

  // Add player count
  if (game['players-supported'] <= 4) {
    const playersIcon = document.createElement('img');
    playersIcon.className = 'overlay-logo';
    playersIcon.src = `_main/images/cover-players-${game['players-supported']}.png`;
    bannerCard.appendChild(playersIcon);
  }
  else if (game['players-supported'] > 4) {
    const playersIcon = document.createElement('img');
    playersIcon.className = 'overlay-logo';
    playersIcon.src = `_main/images/cover-players-many.png`;
    bannerCard.appendChild(playersIcon);
  }

  // Add project logo
  const logo = document.createElement('img');
  logo.className = 'overlay-logo';
  logo.src = `art/${game['project-id']}/cover-logo.png`;
  bannerCard.appendChild(logo);

  card.appendChild(bannerCard);
  return card;
}

function updateCarousel() {
  const cards = document.querySelectorAll('.game-card');
  cards.forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });

  const carousel = document.getElementById('carousel');
  const containerWidth = carousel.parentElement.offsetWidth;
  const cardWidth = 500;
  const gap = 40;

  const cardPosition = currentIndex * (cardWidth + gap);

  const offset = (containerWidth / 2) - (cardWidth / 2) - cardPosition;

  carousel.style.transform = `translateX(${offset}px)`;

  updateGameInfo();
}

function updateGameInfo() {
  const game = games[currentIndex];
  document.getElementById('game-title').textContent = game['project-title'];
  document.getElementById('game-tags').textContent = game['project-tags'] || 'No tags';
  document.getElementById('game-status').textContent = `Status: ${game['project-status']}`;
  document.getElementById('game-info').classList.add('visible');
}

function navigate(direction) {
  currentIndex = Math.max(0, Math.min(games.length - 1, currentIndex + direction));
  updateCarousel();
}

function selectGame(index) {
  currentIndex = index;
  updateCarousel();
}

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');

  carousel.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      navigate(1);
    } else {
      navigate(-1);
    }
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  window.addEventListener('resize', () => {
    updateCarousel();
  });
});