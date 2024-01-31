const { i18n } = require("./next-i18next.config");

const nextjsConfig = {
  reactStrictMode: true,
  i18n,
  sentry: {
    hideSourceMaps: true,
  },
};

/** @type {import('next').NextConfig} */
module.exports = nextjsConfig;
