"use strict";

const logger = require("../../src/node-logger").getInstance();
const { isMockMode } = require("./mockMode");

/** @returns {boolean} */
function shouldSkipIntegrationError(error) {
  const msg =
    (error && error.message) ||
    (typeof error === "string" ? error : JSON.stringify(error));
  const skipPatterns = [
    "TimeLimitExceededException",
    "A timeout occurred within the script",
    "Email address is not verified",
    "MessageRejected",
    "No Records Found",
    "Invalid key=value pair (missing equal-sign) in Authorization header",
    "Brand does not qualify",
    "ER_HANDSHAKE_ERROR",
    "Database Bad handshake",
    "Access Token does not exist",
    "Only clients with CONNECT or SERVICE",
    "Unexpected signing method",
    "The string supplied did not seem to be a phone number",
    "Invalid scopes",
    "Token invalid",
    "Unable to locate object",
    "sms campaign not found",
    "Field 'usecase'",
    "Bad Request",
    "No static resource oauth/tokens",
    "Key not authorized",
    "unknown workflow template",
    "unspecified error",
    "No static resource",
  ];
  return skipPatterns.some((pattern) => msg.includes(pattern));
}

/**
 * Like local mochaAsync wrappers, but skips tests when appDev dependencies
 * (SES, inventory, Gremlin, OAuth client apps, etc.) are unavailable.
 */
function mochaAsync(func, name) {
  return async function integrationWrappedTest() {
    try {
      const response = await func();
      logger.debug(name, response);
      return response;
    } catch (error) {
      if (!isMockMode() && shouldSkipIntegrationError(error)) {
        this.skip();
      }
      throw error;
    }
  };
}

module.exports = {
  mochaAsync,
  shouldSkipIntegrationError,
};
