async function loadPortfolio() {
  try {
    const scripts = document.getElementsByTagName("script");
    let jsonFile = "/portfolio/portfolio.json"; // default fallback

    for (let s of scripts) {
      if (s.src.includes("portfolio.js")) {
        jsonFile = s.getAttribute("data-json") || jsonFile;
        break;
      }
    }

    const response = await fetch(jsonFile);
    const projects = await response.json();

    const categories = {};
    projects.forEach(project => {
      if (!categories[project.category]) {
        categories[project.category] = [];
      }
      categories[project.category].push(project);
    });

    const jumpBar = document.getElementById("portfolio-jump-bar");
    if (jumpBar) {
      Object.keys(categories).forEach(cat => {
        const btn = document.createElement("a");
        btn.href = `#category-${cat.toLowerCase()}`;
        btn.className = "portfolio-jump-btn";
        btn.textContent = cat;
        jumpBar.appendChild(btn);
      });
    }

    const container = document.getElementById("portfolio-container");
    if (!container) return;
    container.innerHTML = '';

    Object.entries(categories).forEach(([cat, items]) => {
      const section = document.createElement("div");
      section.className = "portfolio-section";
      section.id = `category-${cat.toLowerCase()}`;

      section.innerHTML = `<h2 class="portfolio-category-title">${cat}</h2><hr>`;

      items.forEach(project => {
        const hasImages = project.images && project.images.length > 0;
        const allImages = project.mainImage
          ? [project.mainImage, ...(project.images || [])]
          : (project.images || []);

        const linksHTML = project.links && project.links.length > 0
          ? `<div class="portfolio-links">${project.links.map(l => `<a href="${l.url}" class="portfolio-link" target="_blank">${l.label}</a>`).join('')}</div>`
          : '';

        let galleryHTML = '';
        if (allImages.length > 0) {
          const thumbs = allImages.map((img, i) =>
            `<img src="${img}" class="portfolio-thumb${i === 0 ? ' active' : ''}" data-index="${i}" alt="${project.title} screenshot ${i + 1}" loading="lazy">`
          ).join('');

          galleryHTML = `
            <div class="portfolio-gallery">
              <div class="portfolio-main-image-wrap">
                <img src="${allImages[0]}" class="portfolio-main-image" id="main-img-${project.title.replace(/\s+/g,'-')}" alt="${project.title} main image">
                ${allImages.length > 1 ? `
                  <button class="gallery-arrow gallery-prev" aria-label="Previous">&#8249;</button>
                  <button class="gallery-arrow gallery-next" aria-label="Next">&#8250;</button>
                ` : ''}
              </div>
              ${allImages.length > 1 ? `<div class="portfolio-thumbs">${thumbs}</div>` : ''}
            </div>
          `;
        } else if (project.mainImage) {
          galleryHTML = `
            <div class="portfolio-gallery">
              <div class="portfolio-main-image-wrap">
                <img src="${project.mainImage}" class="portfolio-main-image" alt="${project.title} main image">
              </div>
            </div>
          `;
        }

        const card = document.createElement("div");
        card.className = "portfolio-card";
        card.innerHTML = `
          ${galleryHTML}
          <div class="portfolio-info">
            <h3 class="portfolio-title">${project.title}</h3>
            <p class="portfolio-description">${project.description}</p>
            ${linksHTML}
          </div>
        `;
        section.appendChild(card);

        if (allImages.length > 1) {
          const mainImg = card.querySelector('.portfolio-main-image');
          const thumbs = card.querySelectorAll('.portfolio-thumb');
          const prevBtn = card.querySelector('.gallery-prev');
          const nextBtn = card.querySelector('.gallery-next');
          let current = 0;

          function goTo(index) {
            current = (index + allImages.length) % allImages.length;
            mainImg.src = allImages[current];
            thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
          }

          thumbs.forEach((t, i) => t.addEventListener('click', () => goTo(i)));
          prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
          nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
        }
      });

      container.appendChild(section);
    });

  } catch (err) {
    console.error("Failed to load portfolio:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPortfolio);