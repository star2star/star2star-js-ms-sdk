"use strict";

const { v4 } = require("uuid");

const MOCK_MS_HOST = "https://mock-ms.test";
const MOCK_AUTH_HOST = "https://mock-auth.test";
const MOCK_ACCESS_TOKEN = "mock-access-token-for-tests";

const USER_UUID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const ACCOUNT_UUID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const ADMIN_GROUP_UUID = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const USER_GROUP_UUID = "dddddddd-dddd-dddd-dddd-dddddddddddd";

const identityFixture = () => ({
  user_uuid: USER_UUID,
  uuid: USER_UUID,
  account_uuid: ACCOUNT_UUID,
  email: "mock.user@test.example",
  username: "mock.user@test.example",
  first_name: "Mock",
  last_name: "User",
  status: "active",
  aliases: [],
  properties: {},
});

module.exports = {
  MOCK_MS_HOST,
  MOCK_AUTH_HOST,
  MOCK_ACCESS_TOKEN,
  USER_UUID,
  ACCOUNT_UUID,
  ADMIN_GROUP_UUID,
  USER_GROUP_UUID,
  identityFixture,
  newUuid: v4,
};
