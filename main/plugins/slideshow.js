let slideIndex = 1;

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const thumbnails = document.getElementsByClassName("thumbnail-img");
  if (slides.length === 0) return;

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    thumbnails[i].classList.remove("active-thumbnail");
  }

  // Show current slide
  slides[slideIndex - 1].style.display = "block";
  thumbnails[slideIndex - 1].classList.add("active-thumbnail");

  // Scroll thumbnail strip to show active thumbnail
  thumbnails[slideIndex - 1].scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});

}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

async function loadSlideshow() {
  try {
    const scripts = document.getElementsByTagName("script");
    let jsonFile = "slideshow.json";

    for (let s of scripts) {
      if (s.src.includes("slideshow.js")) {
        jsonFile = s.getAttribute("data-json") || jsonFile;
        break;
      }
    }

    const response = await fetch(jsonFile);
    const slides = await response.json();

    const container = document.getElementById("slideshow-container");
    const thumbsContainer = document.getElementById("slideshow-thumbnails");
    container.innerHTML = '';
    thumbsContainer.innerHTML = '';

    slides.forEach((slide, index) => {
      // Main slides
      const slideHTML = `
        <div class="mySlides fade">
          <div class="numbertext">${index + 1} / ${slides.length}</div>
          <center>
            <img width="800" src="${slide.image}" alt="Slide ${index + 1}">
          </center>
          <div class="text">${slide.caption}</div>
        </div>
      `;
      container.innerHTML += slideHTML;

      // Thumbnails
      const thumbHTML = `
        <img src="${slide.image}" class="thumbnail-img" onclick="currentSlide(${index + 1})" alt="Slide ${index + 1}">
      `;
      thumbsContainer.innerHTML += thumbHTML;
    });

    showSlides(slideIndex);

  } catch (err) {
    console.error("Failed to load slideshow:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadSlideshow);
