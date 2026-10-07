const easterBunny = document.getElementById("easterBunny");
const debugBar = document.getElementById("debugBar");

let bunnyClicks = 0;

function runEasterBunny() {
  if (!easterBunny) return;

  easterBunny.classList.remove("run");

  void easterBunny.offsetWidth;

  easterBunny.classList.add("run");
}

function triggerBunny() {
  bunnyClicks = 0;

  if (debugBar) {
    debugBar.classList.add("show");

    setTimeout(() => {
      debugBar.classList.remove("show");
    }, 3000);
  }

  runEasterBunny();
}

document.addEventListener("click", () => {
  bunnyClicks++;

  if (bunnyClicks >= 5) {
    triggerBunny();
  }
});

if (easterBunny) {
  easterBunny.addEventListener("animationend", event => {
    if (event.animationName === "rabbitRun") {
      easterBunny.classList.remove("run");
    }
  });
}