"use strict";

const { buildResponse } = require("../helpers/mockFetch");

function resetEmailMockStore() {
  // stateless
}

function emailMockRouter(method, url) {
  if (!url.pathname.startsWith("/email/")) {
    return null;
  }

  if (method === "POST" && url.pathname === "/email/messages/send") {
    return Promise.resolve(buildResponse(200, { status: "sent", message_id: "mock-message-id" }));
  }

  return null;
}

module.exports = {
  resetEmailMockStore,
  emailMockRouter,
};
