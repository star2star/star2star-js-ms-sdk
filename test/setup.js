"use strict";

const s2sMS = require("../src/index");
const { installMockFetch } = require("./helpers/mockFetch");
const { msMockRouter, resetAllMockStores } = require("./helpers/msMockRouter");
const {
  MOCK_MS_HOST,
  MOCK_AUTH_HOST,
  USER_UUID,
  ACCOUNT_UUID,
} = require("./fixtures/mockConstants");

const useLiveMs =
  process.env.USE_LIVE_MS === "1" ||
  (process.env.CPAAS_URL && process.env.USE_MOCK_MS !== "1" && process.env.USE_LIVE_MS !== "0");

if (!process.env.MS_HOST && process.env.CPAAS_URL) {
  process.env.MS_HOST = process.env.CPAAS_URL;
}
if (!process.env.TEST_IDENTITY && process.env.USER_UUID) {
  process.env.TEST_IDENTITY = process.env.USER_UUID;
}

if (!useLiveMs) {
  process.env.CPAAS_URL = MOCK_MS_HOST;
  process.env.AUTH_URL = MOCK_AUTH_HOST;
  process.env.MS_HOST = MOCK_MS_HOST;
  process.env.AUTH_HOST = MOCK_AUTH_HOST;
  process.env.BASIC_TOKEN = process.env.BASIC_TOKEN || "mock-basic-auth";
  process.env.EMAIL = process.env.EMAIL || "mock.user@test.example";
  process.env.PASSWORD = process.env.PASSWORD || "mock-password";
  process.env.USER_UUID = process.env.USER_UUID || USER_UUID;
  process.env.ACCOUNT_UUID = process.env.ACCOUNT_UUID || ACCOUNT_UUID;
  process.env.PUSH_TOKEN = process.env.PUSH_TOKEN || "mock-push-token";
  process.env.SMS_FROM = process.env.SMS_FROM || "9415551234";
  process.env.SMS_TO = process.env.SMS_TO || "9415555678";

  resetAllMockStores();
  installMockFetch(msMockRouter);
}

s2sMS.setMsHost(
  process.env.MS_HOST ||
    process.env.CPAAS_URL ||
    MOCK_MS_HOST
);
s2sMS.setMSVersion(
  process.env.CPAAS_API_VERSION || process.env.MS_VERSION || "v1"
);
s2sMS.setMsAuthHost(
  process.env.AUTH_HOST || process.env.AUTH_URL || MOCK_AUTH_HOST
);

exports.useLiveMs = useLiveMs;
