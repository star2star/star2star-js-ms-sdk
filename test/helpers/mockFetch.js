"use strict";

function buildHeaders(extra = {}) {
  const headerMap = {
    "content-type": "application/json",
    ...extra,
  };
  return {
    ...headerMap,
    get(name) {
      const key = name.toLowerCase();
      return headerMap[key] ?? headerMap[name] ?? null;
    },
  };
}

function buildResponse(status, body, options = {}) {
  const hasBody = typeof body !== "undefined" && body !== null && status !== 204;
  const text = hasBody ? JSON.stringify(body) : "";
  return {
    ok: status >= 200 && status < 300,
    status,
    redirected: false,
    headers: buildHeaders(options.headers),
    async json() {
      if (!text) {
        return {};
      }
      return JSON.parse(text);
    },
    async text() {
      return text;
    },
  };
}

/**
 * @param {(method: string, url: URL, init: RequestInit) => Response|Promise<Response>} router
 */
function installMockFetch(router) {
  const originalFetch = global.fetch;
  global.fetch = async (input, init = {}) => {
    const url =
      typeof input === "string"
        ? new URL(input)
        : input instanceof URL
          ? input
          : new URL(input.url);
    const method = (init.method || "GET").toUpperCase();
    return router(method, url, init);
  };
  return () => {
    global.fetch = originalFetch;
  };
}

module.exports = {
  buildResponse,
  installMockFetch,
};
