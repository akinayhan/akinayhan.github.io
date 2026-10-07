/* ===================== YEAR ===================== */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ===================== THEME ===================== */

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
      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );

      theme = "light";
    } else {
      document.documentElement.removeAttribute(
        "data-theme"
      );

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


/* ===================== DEBUG / EASTER EGG ===================== */

const debugBar =
  document.getElementById("debugBar");

const easterBunny =
  document.getElementById("easterBunny");

let clicks = 0;

function runEasterBunny() {
  easterBunny.classList.remove("run");

  void easterBunny.offsetWidth;

  easterBunny.classList.add("run");
}

document.body.onclick = () => {
  if (++clicks === 5) {

    debugBar.classList.add("show");

    runEasterBunny();

    setTimeout(() => {
      debugBar.classList.remove("show");
    }, 3000);

    clicks = 0;
  }
};

/* ===================== MESSAGES ===================== */

let deck = [];

function refillDeck() {
  if (!translations) {
    return;
  }

  let list = [
    ...translations.messages.general,
    ...(theme === "dark"
      ? translations.messages.night
      : translations.messages.day)
  ];

  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [list[i], list[j]] = [list[j], list[i]];
  }

  deck = list;
}

function nextMsg() {
  if (deck.length === 0) {
    refillDeck();
  }

  return deck.pop() || "";
}


/* ===================== TYPEWRITER ===================== */

let msg = "";
let i = 0;
let typewriterTimer = null;

const el = document.getElementById("text");

function clearTypewriter() {
  if (typewriterTimer) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }
}

function startTypewriter() {
  clearTypewriter();

  msg = nextMsg();
  i = 0;

  el.textContent = "";

  type();
}

function type() {
  if (i < msg.length) {
    el.textContent += msg[i++];

    typewriterTimer = setTimeout(
      type,
      35
    );
  } else {
    typewriterTimer = setTimeout(
      erase,
      2000
    );
  }
}

function erase() {
  if (i > 0) {
    el.textContent = msg.substring(
      0,
      --i
    );

    typewriterTimer = setTimeout(
      erase,
      20
    );
  } else {
    msg = nextMsg();

    typewriterTimer = setTimeout(
      type,
      400
    );
  }
}


/* ===================== LANGUAGE CHANGE ===================== */

window.addEventListener(
  "languageChanged",
  () => {
    refillDeck();
    startTypewriter();
    showFirstQuote();
  }
);


/* ===================== PARTICLES ===================== */

const c = document.getElementById("particles");
const ctx = c.getContext("2d");

function resize() {
  c.width = innerWidth;
  c.height = innerHeight;
}

resize();

onresize = resize;

class P {
  constructor() {
    this.x = Math.random() * c.width;
    this.y = Math.random() * c.height;

    this.vx =
      (Math.random() - 0.5) * 0.6;

    this.vy =
      (Math.random() - 0.5) * 0.6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < 0 ||
      this.x > c.width ||
      this.y < 0 ||
      this.y > c.height
    ) {
      this.x = Math.random() * c.width;
      this.y = Math.random() * c.height;
    }
  }

  draw() {
    ctx.fillStyle =
      getComputedStyle(
        document.documentElement
      ).getPropertyValue(
        "--particle"
      );

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      1.8,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}

let ps = [];

for (let i = 0; i < 140; i++) {
  ps.push(new P());
}

(function anim() {
  ctx.clearRect(
    0,
    0,
    c.width,
    c.height
  );

  ps.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(anim);
})();


/* ===================== FLOATING POEM ===================== */

const box =
  document.getElementById(
    "floatingQuotes"
  );

let qi = 0;
let side = false;

function getQuotes() {
  if (!translations) {
    return [];
  }

  return translations.quotes || [];
}

function showFirstQuote() {
  const quotes = getQuotes();

  if (!quotes.length) {
    return;
  }

  box.textContent = quotes[0];

  box.classList.remove("dust-out");
  box.classList.add("dust-in");

  qi = 1;
}

function flow() {
  const quotes = getQuotes();

  if (!quotes.length) {
    return;
  }

  box.classList.remove("dust-in");
  box.classList.add("dust-out");

  setTimeout(() => {
    side = !side;

    box.classList.toggle(
      "right",
      side
    );

    box.textContent = quotes[qi];

    qi =
      (qi + 1) %
      quotes.length;

    box.classList.remove("dust-out");
    box.classList.add("dust-in");
  }, 800);
}

setInterval(
  flow,
  3500
);


/* ===================== START ===================== */

const waitForTranslations =
  setInterval(() => {
    if (translations) {
      clearInterval(
        waitForTranslations
      );

      refillDeck();
      startTypewriter();
      showFirstQuote();
    }
  }, 50);