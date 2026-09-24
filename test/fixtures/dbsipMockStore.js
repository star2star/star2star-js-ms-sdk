"use strict";

const { buildResponse } = require("../helpers/mockFetch");
const { ACCOUNT_UUID } = require("./mockConstants");

const dbsipStore = {
  destinations: [],
};

function paginate(items, qs) {
  const offset = Number(qs.offset ?? qs.skip ?? 0);
  const limit = Number(qs.limit || 100);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function seedDbsip() {
  dbsipStore.destinations = Array.from({ length: 25 }, (_, i) => ({
    id: i === 0 ? 1256900 : 1256900 + i,
    account_uuid: ACCOUNT_UUID,
    name: `Destination ${i}`,
  }));
}

function resetDbsipMockStore() {
  seedDbsip();
}

function dbsipMockRouter(method, url) {
  if (!url.pathname.startsWith("/dbsip/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  const accountDest = url.pathname.match(/^\/dbsip\/accounts\/([^/]+)\/destinations$/);
  if (accountDest && method === "GET") {
    return Promise.resolve(buildResponse(200, paginate(dbsipStore.destinations, qs)));
  }

  const destById = url.pathname.match(/^\/dbsip\/destinations\/([^/]+)$/);
  if (destById && method === "GET") {
    const id = Number(destById[1]);
    const dest = dbsipStore.destinations.find((d) => d.id === id) || { id };
    return Promise.resolve(buildResponse(200, dest));
  }

  return null;
}

module.exports = {
  resetDbsipMockStore,
  dbsipMockRouter,
};
