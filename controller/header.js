const bodyTag = document.querySelector(".dashboardContainer");
const homeTag = document.querySelector(".homeTab");
const fetureTag = document.querySelector(".feturesTab");
const moreTab = document.querySelector(".moreTab");
const loginTab = document.querySelector(".loginTab");

const main = document.querySelector("main");
const movingHl = document.querySelector(".movingHl");

homeTag.addEventListener("click", () => {
    fetch("pages/home.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load home.html");
      }
      movingHl.classList.add("animationHome");
      return response.text();
    })
    .then(html => {
      main.innerHTML = html;
    })
    .catch(error => {
      main.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});

fetureTag.addEventListener("click", () => {
    fetch("pages/fetures.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load fetures.html");
      }
      movingHl.classList.add("animationFeature");
      movingHl.classList.remove("animationMore");
      movingHl.classList.remove("animationHome");
      return response.text();
    })
    .then(html => {
      main.innerHTML = html;
    })
    .catch(error => {
      main.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});

moreTab.addEventListener("click", () => {
    fetch("pages/more.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load more.html");
      }
      movingHl.classList.add("animationMore");
      movingHl.classList.remove("animationHome");
      movingHl.classList.remove("animationFeature");
      return response.text();
    })
    .then(html => {
      main.innerHTML = html;
    })
    .catch(error => {
      main.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});

loginTab.addEventListener("click", () => {
    fetch("pages/admin/dashboard.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load dashboard.html");
      }
      return response.text();
    })
    .then(html => {
      main.innerHTML = html;
    })
    .catch(error => {
      main.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});