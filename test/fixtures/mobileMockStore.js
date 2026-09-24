"use strict";

const { buildResponse } = require("../helpers/mockFetch");

const mobileStore = {
  registrations: new Set(),
};

function resetMobileMockStore() {
  mobileStore.registrations.clear();
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

function mobileMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/mobilenotification/")) {
    return null;
  }

  if (method === "POST" && url.pathname === "/mobilenotification/registration") {
    return readJsonBody(init).then((body) => {
      if (body?.push_token) {
        mobileStore.registrations.add(body.push_token);
      }
      return buildResponse(200, { status: "ok" });
    });
  }

  if (method === "GET" && url.pathname === "/mobilenotification/registration") {
    return Promise.resolve(
      buildResponse(200, {
        items: [...mobileStore.registrations].map((token) => ({ push_token: token })),
      })
    );
  }

  const unregister = url.pathname.match(/^\/mobilenotification\/registration\/([^/]+)$/);
  if (unregister && method === "DELETE") {
    mobileStore.registrations.delete(decodeURIComponent(unregister[1]));
    return Promise.resolve(buildResponse(202, null));
  }

  return null;
}

module.exports = {
  resetMobileMockStore,
  mobileMockRouter,
};
