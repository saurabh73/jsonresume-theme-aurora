// Import Style
import "./../styles/style.scss";
console.log('script.js loaded');

const toggleBtn = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
toggleBtn.addEventListener('click', function () {
  sidebar.classList.toggle('show-sidebar');
});

const setTheme = function (themeDiv) {
  let root = document.documentElement;
  root.style.setProperty('--side-background', themeDiv[0].getAttribute("data-color"));
  root.style.setProperty('--highlight-color', themeDiv[1].getAttribute("data-color"));
  root.style.setProperty('--page-background', themeDiv[2].getAttribute("data-color"));
  root.style.setProperty('--side-color', themeDiv[2].getAttribute("data-color"));
  root.style.setProperty('--page-color', themeDiv[3].getAttribute("data-color"));
};

const loadTheme = function () {
  const bodyClasses = document.querySelector('body').classList;
  const themeClass = bodyClasses[1];
  if (themeClass && themeClass.startsWith("theme-")) {
    const themeNo = parseInt(themeClass.split("theme-")[1]);
   
    const themeDivs = document.querySelectorAll(".theme-item");
    const totalThemes = themeDivs.length;
    console.log(themeNo, totalThemes);
    let selectedTheme = 0;
    if (themeNo > 0 && themeNo <= totalThemes) {
      selectedTheme = themeNo;
      const themeItem = themeDivs[selectedTheme - 1];
      const themeDiv = themeItem.querySelectorAll("div");
      setTheme(themeDiv);
    }
  }
};

loadTheme();



const themeFunction = function (event) {
  const themeDiv = event.srcElement.querySelectorAll("div");
  setTheme(themeDiv);
};
const themeItems = document.querySelectorAll('.theme-item');
themeItems.forEach(item => {
  item.addEventListener('click', themeFunction);
});


const themeBoxes = document.querySelectorAll("[data-color]");
themeBoxes.forEach(element => {
  element.style.backgroundColor = element.getAttribute("data-color");
});