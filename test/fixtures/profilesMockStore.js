"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const profilesStore = {
  properties: new Map(),
};

function resetProfilesMockStore() {
  profilesStore.properties.clear();
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

function profilesMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/profiles/")) {
    return null;
  }

  const createProp = url.pathname.match(/^\/profiles\/users\/([^/]+)\/properties$/);
  if (createProp && method === "POST") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const property = { ...(body || {}), uuid };
      profilesStore.properties.set(uuid, property);
      return buildResponse(200, property);
    });
  }

  if (createProp && method === "GET") {
    const items = [...profilesStore.properties.values()];
    return Promise.resolve(buildResponse(200, { items }));
  }

  const updateProp = url.pathname.match(/^\/profiles\/context\/properties\/([^/]+)$/);
  if (updateProp && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = profilesStore.properties.get(updateProp[1]) || { uuid: updateProp[1] };
      const updated = { ...existing, ...(body || {}) };
      profilesStore.properties.set(updateProp[1], updated);
      return buildResponse(200, updated);
    });
  }

  return null;
}

module.exports = {
  resetProfilesMockStore,
  profilesMockRouter,
};
