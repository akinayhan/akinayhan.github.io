const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

let theme = "dark";

const toggle = document.getElementById("themeToggle");
const wipe = document.getElementById("themeWipe");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");

function icon() {
  toggle.textContent = theme === "dark" ? "🌙" : "☀️";
}

icon();

toggle.onclick = () => {
  wipe.classList.add("active");

  const next = theme === "dark" ? "light" : "dark";

  if (next === "light") {
    moon.style.animation = "set .6s forwards";

    setTimeout(() => {
      sun.style.animation = "rise .7s forwards";
    }, 200);
  } else {
    sun.style.animation = "set .6s forwards";

    setTimeout(() => {
      moon.style.animation = "rise .7s forwards";
    }, 200);
  }

  setTimeout(() => {
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme");
      theme = "dark";
    }

    icon();
    refillDeck();
  }, 300);

  setTimeout(() => {
    wipe.classList.remove("active");
    sun.style.animation = "";
    moon.style.animation = "";
  }, 800);
};

const deck = [];

function refillDeck() {
  if (!translations) return;

  const messages = translations.messages || {};
  const general = messages.general || [];
  const themed = theme === "dark"
    ? (messages.night || [])
    : (messages.day || []);

  deck.length = 0;
  deck.push(...general, ...themed);

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function nextMsg() {
  if (!deck.length) {
    refillDeck();
  }

  return deck.pop() || "";
}

const textElement = document.getElementById("text");
let typingTimer = null;

function startTypewriter() {
  if (!textElement) return;

  clearTimeout(typingTimer);

  const message = nextMsg();
  let index = 0;

  textElement.textContent = "";

  function type() {
    if (index < message.length) {
      textElement.textContent += message[index++];
      typingTimer = setTimeout(type, 35);
      return;
    }

    typingTimer = setTimeout(erase, 2000);
  }

  function erase() {
    if (index > 0) {
      textElement.textContent = message.slice(0, --index);
      typingTimer = setTimeout(erase, 20);
      return;
    }

    typingTimer = setTimeout(startTypewriter, 400);
  }

  type();
}

window.addEventListener("languageChanged", () => {
  refillDeck();
  startTypewriter();
  showFirstQuote();
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.reset();
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.vx = (Math.random() - .5) * .3;
    this.vy = (Math.random() - .5) * .3;
    this.size = Math.random() * 1.5 + .5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    ) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
  }

  draw() {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--particle")
      .trim();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 140; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

const floatingQuotes = document.getElementById("floatingQuotes");

let quoteIndex = 0;
let quoteSide = false;

function getQuotes() {
  if (!translations) return [];

  return translations.quotes || [];
}

function showFirstQuote() {
  const quotes = getQuotes();

  if (!quotes.length || !floatingQuotes) return;

  quoteIndex = 0;
  floatingQuotes.textContent = quotes[quoteIndex];

  floatingQuotes.classList.remove("right", "dust-out");
  floatingQuotes.classList.add("dust-in");
}

function flow() {
  const quotes = getQuotes();

  if (!quotes.length || !floatingQuotes) return;

  floatingQuotes.classList.remove("dust-in");
  floatingQuotes.classList.add("dust-out");

  setTimeout(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteSide = !quoteSide;

    floatingQuotes.textContent = quotes[quoteIndex];
    floatingQuotes.classList.toggle("right", quoteSide);

    floatingQuotes.classList.remove("dust-out");
    floatingQuotes.classList.add("dust-in");
  }, 800);
}

setInterval(flow, 3500);

const waitForTranslations = setInterval(() => {
  if (translations) {
    clearInterval(waitForTranslations);

    refillDeck();
    startTypewriter();
    showFirstQuote();
  }
}, 50);