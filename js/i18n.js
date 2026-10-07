const supportedLanguages = [
  "tr",
  "en",
  "de",
  "es",
  "fr",
  "it",
  "nl",
  "zh",
  "ko"
];

const defaultLanguage = "tr";

let currentLanguage = defaultLanguage;
let translations = null;


/* ===================== LANGUAGE DETECTION ===================== */

function getSavedLanguage() {
  return localStorage.getItem("language");
}

function getBrowserLanguage() {

  const languages =
    navigator.languages || [
      navigator.language
    ];

  for (const browserLanguage of languages) {

    const language =
      browserLanguage
        .toLowerCase()
        .split("-")[0];

    if (
      supportedLanguages.includes(
        language
      )
    ) {
      return language;
    }

  }

  return null;
}

function detectLanguage() {

  const savedLanguage =
    getSavedLanguage();

  if (
    savedLanguage &&
    supportedLanguages.includes(
      savedLanguage
    )
  ) {
    return savedLanguage;
  }

  return (
    getBrowserLanguage() ||
    defaultLanguage
  );

}


/* ===================== LOAD LANGUAGE ===================== */

async function loadLanguage(language) {

  if (
    !supportedLanguages.includes(
      language
    )
  ) {
    language =
      defaultLanguage;
  }

  try {

    const response =
      await fetch(
        `locales/${language}.json`
      );

    if (!response.ok) {

      throw new Error(
        `Language file could not be loaded: ${language}`
      );

    }

    translations =
      await response.json();

    currentLanguage =
      language;

    document.documentElement.lang =
      language;

    applyTranslations();

    updateLanguageSwitcher();

    localStorage.setItem(
      "language",
      language
    );

    window.dispatchEvent(
      new Event(
        "languageChanged"
      )
    );

  } catch (error) {

    console.error(
      "i18n error:",
      error
    );

  }

}


/* ===================== TRANSLATION ===================== */

function translate(key) {

  const parts =
    key.split(".");

  let value =
    translations;

  for (const part of parts) {

    if (
      value &&
      Object.prototype.hasOwnProperty.call(
        value,
        part
      )
    ) {

      value =
        value[part];

    } else {

      return key;

    }

  }

  return value;

}


/* ===================== APPLY TRANSLATIONS ===================== */

function applyTranslations() {

  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach(element => {

      const key =
        element.dataset.i18n;

      const value =
        translate(key);

      if (key === "footer") {

        element.innerHTML =
          `© <span id="year"></span> · ${value}`;

        const year =
          document.getElementById(
            "year"
          );

        if (year) {

          year.textContent =
            new Date()
              .getFullYear();

        }

      } else {

        element.textContent =
          value;

      }

    });

}


/* ===================== LANGUAGE SWITCHER ===================== */

const languageSwitcher =
  document.getElementById(
    "languageSwitcher"
  );

const languageButton =
  document.getElementById(
    "languageButton"
  );

const languageMenu =
  document.getElementById(
    "languageMenu"
  );


/* OPEN / CLOSE */

languageButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    const isOpen =
      languageSwitcher.classList.toggle(
        "open"
      );

    languageButton.classList.toggle(
      "active",
      isOpen
    );

    languageButton.setAttribute(
      "aria-expanded",
      isOpen
    );

  }
);


/* LANGUAGE SELECTION */

languageMenu
  .querySelectorAll("button")
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const language =
          button.dataset.lang;

        if (
          language !==
          currentLanguage
        ) {

          loadLanguage(
            language
          );

        }

        closeLanguageMenu();

      }
    );

  });


/* CLOSE */

function closeLanguageMenu() {

  languageSwitcher.classList.remove(
    "open"
  );

  languageButton.classList.remove(
    "active"
  );

  languageButton.setAttribute(
    "aria-expanded",
    "false"
  );

}


/* CLICK OUTSIDE */

document.addEventListener(
  "click",
  event => {

    if (
      !languageSwitcher.contains(
        event.target
      )
    ) {

      closeLanguageMenu();

    }

  }
);


/* ACTIVE LANGUAGE */

function updateLanguageSwitcher() {

  languageMenu
    .querySelectorAll("button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.lang ===
          currentLanguage
      );

    });

}


/* ===================== INIT ===================== */

async function initI18n() {

  const language =
    detectLanguage();

  await loadLanguage(
    language
  );

}

initI18n();