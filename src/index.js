const logger = require("@bedrockio/logger");
const config = require("@bedrockio/config");

const app = require("./app");

const { getBrowser } = require("./utils/browser");

const PORT = config.get("BIND_PORT");
const HOST = config.get("BIND_HOST");

const GOOGLE_CLOUD_LOGGING = config.get("GOOGLE_CLOUD_LOGGING", "boolean");

if (GOOGLE_CLOUD_LOGGING) {
  logger.setupGoogleCloud({
    logging: true,
  });
} else {
  logger.useFormatted();
}

module.exports = (async () => {
  await getBrowser();

  app.listen(PORT, HOST, () => {
    logger.info(`Started on port //${HOST}:${PORT}`);
  });
  return app;
})();
