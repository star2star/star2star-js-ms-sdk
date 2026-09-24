"use strict";

const { buildResponse } = require("../helpers/mockFetch");

function resetResourcesMockStore() {
  // stateless search handler
}

async function readJsonBody(init) {
  if (!init?.body) {
    return undefined;
  }
  if (typeof init.body === "string") {
    try {
      return JSON.parse(init.body);
    } catch {
      return undefined;
    }
  }
  return init.body;
}

function resourcesMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/resourcecms/")) {
    return null;
  }

  const search = url.pathname.match(/^\/resourcecms\/instance\/([^/]+)\/search$/);
  if (search && method === "POST") {
    return readJsonBody(init).then(() =>
      buildResponse(200, { uuid: search[1] })
    );
  }

  return null;
}

module.exports = {
  resetResourcesMockStore,
  resourcesMockRouter,
};
