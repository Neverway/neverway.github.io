async function loadNews() {
  try {
    // Find the script tag by matching its src
    const scripts = document.getElementsByTagName("script");
    let jsonFile = "/home/news.json"; // default fallback

    for (let s of scripts) {
      if (s.src.includes("/home/news.js")) {
        jsonFile = s.getAttribute("data-json") || jsonFile;
        break;
      }
    }

    const response = await fetch(jsonFile);
    const posts = await response.json();

    const container = document.getElementById("news-container");
    container.innerHTML = '';

    posts.forEach(post => {
      const postHTML = `
        <div class="news-post">
          <h2 class="title">${post.title}</h2>
          <p class="date">[${post.date}]</p>
          <p class="content">${post.content}</p>
          <p class="author">Best regards,<br><span class="author-name">${post.author}</span></p>
          <hr>
        </div>
      `;
      container.innerHTML += postHTML;
    });
  } catch (err) {
    console.error("Failed to load news:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
