const { withSentryConfig } = require("@sentry/nextjs");

const { i18n } = require("./next-i18next.config");

const nextjsConfig = {
  reactStrictMode: true,
  i18n,
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackConfig = {
  silent: true,
};

/** @type {import('next').NextConfig} */
module.exports = withSentryConfig(nextjsConfig, sentryWebpackConfig);
