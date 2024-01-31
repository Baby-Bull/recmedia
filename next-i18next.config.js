const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    localePath: path.resolve("./public/locales"),
    localeSubpaths: "none",
    localeDetection: false,
    browserLanguageDetection: false,
    defaultLanguage: "ja",
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
