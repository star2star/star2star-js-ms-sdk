"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

async function readJsonBody(init) {
  if (!init?.body) {
    return undefined;
  }
  if (typeof init.body === "string") {
    if (!init.body.trim()) {
      return undefined;
    }
    try {
      return JSON.parse(init.body);
    } catch {
      return undefined;
    }
  }
  return init.body;
}

function resetNumbersMockStore() {
  // stateless mock
}

function buildDidStrings(qty, qs) {
  const npa = qs.npa ? String(qs.npa) : "305";
  const state = qs.state || "FL";
  return Array.from({ length: qty }, (_, i) => {
    const suffix = String(1000 + i).padStart(4, "0");
    return `1${npa}${suffix}`;
  }).filter(() => state);
}

function numbersMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/sms/")) {
    return null;
  }
  if (url.pathname.startsWith("/sms/10dlc/")) {
    return null;
  }

  if (method === "GET" && url.pathname === "/sms/number/available/states") {
    return Promise.resolve(buildResponse(200, { items: ["AL", "FL"] }));
  }

  const centers = url.pathname.match(/^\/sms\/number\/available\/([^/]+)\/centers$/);
  if (centers && method === "GET") {
    return Promise.resolve(buildResponse(200, { items: ["MIAMI", "ORLANDO"] }));
  }

  const npas = url.pathname.match(/^\/sms\/number\/available\/([^/]+)\/([^/]+)\/npas$/);
  if (npas && method === "GET") {
    return Promise.resolve(buildResponse(200, { items: ["305", "786"] }));
  }

  if (method === "GET" && url.pathname === "/sms/number/available/dids") {
    const qs = Object.fromEntries(url.searchParams.entries());
    const qty = Number(qs.qty || 5);
    const items = buildDidStrings(qty, qs);
    return Promise.resolve(buildResponse(200, { items }));
  }

  if (method === "POST" && url.pathname === "/sms/provision") {
    return readJsonBody(init).then((body) => {
      const numbers = body?.numbers || [];
      return buildResponse(200, { enabled: numbers });
    });
  }

  if (method === "POST" && url.pathname === "/sms/messages/send") {
    return readJsonBody(init).then((body) => {
      void body;
      return buildResponse(200, { uuid: v4(), status: "sent" });
    });
  }

  if (method === "POST" && url.pathname === "/sms/deprovision") {
    return readJsonBody(init).then((body) => {
      const numbers = body?.numbers || [];
      return buildResponse(200, { disabled: numbers });
    });
  }

  if (method === "PUT" && url.pathname === "/sms/provision/numbers/help") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, {
        help_text: body?.help_text,
        numbers: body?.numbers || [],
      })
    );
  }

  if (method === "PUT" && url.pathname === "/sms/provision/numbers/reference") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, {
        reference_id: body?.reference_id,
        numbers: body?.numbers || [],
      })
    );
  }

  const provisionUser = url.pathname.match(/^\/sms\/provision\/numbers\/user\/([^/]+)$/);
  if (provisionUser && method === "GET") {
    return Promise.resolve(buildResponse(200, { items: [] }));
  }

  const provisionAccount = url.pathname.match(/^\/sms\/provision\/numbers\/account\/([^/]+)$/);
  if (provisionAccount && method === "GET") {
    return Promise.resolve(buildResponse(200, { items: [] }));
  }

  return null;
}

module.exports = {
  resetNumbersMockStore,
  numbersMockRouter,
};
