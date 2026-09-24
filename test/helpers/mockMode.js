"use strict";

const { MOCK_MS_HOST } = require("../fixtures/mockConstants");

function isMockMode() {
  if (process.env.USE_LIVE_MS === "1") {
    return false;
  }
  const host = process.env.CPAAS_URL || process.env.MS_HOST || "";
  return host.includes("mock-ms.test") || process.env.USE_MOCK_MS === "1";
}

module.exports = {
  isMockMode,
  MOCK_MS_HOST,
};
