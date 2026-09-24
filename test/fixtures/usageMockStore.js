"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { ACCOUNT_UUID } = require("./mockConstants");

const usageStore = {
  templateUuid: v4(),
  reports: new Map(),
};

function paginate(items, qs) {
  const offset = Number(qs.offset ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function resetUsageMockStore() {
  usageStore.templateUuid = v4();
  usageStore.reports.clear();
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

function usageMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/usage/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "POST" && url.pathname === "/usage/events") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, {
        account_uuid: body?.account_uuid || ACCOUNT_UUID,
        metadata: body?.metadata || {},
        event_type: body?.event_type,
      })
    );
  }

  const billing = url.pathname.match(/^\/usage\/accounts\/([^/]+)\/billing_cycle$/);
  if (billing && method === "GET") {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return Promise.resolve(
      buildResponse(200, {
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      })
    );
  }

  if (method === "GET" && url.pathname === "/usage/reports/templates") {
    const items = [{ uuid: usageStore.templateUuid, name: "Mock Usage Template" }];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const runReport = url.pathname.match(/^\/usage\/reports\/templates\/([^/]+)\/events\/evaluate$/);
  if (runReport && method === "POST") {
    const report_uuid = v4();
    usageStore.reports.set(report_uuid, { report_uuid, status: "SUCCEEDED" });
    return Promise.resolve(
      buildResponse(200, { report_uuid, status: "SUCCEEDED", account_uuid: ACCOUNT_UUID })
    );
  }

  const getReport = url.pathname.match(/^\/usage\/reports\/([^/]+)$/);
  if (getReport && method === "GET") {
    const report = usageStore.reports.get(getReport[1]) || {
      report_uuid: getReport[1],
      status: "SUCCEEDED",
    };
    return Promise.resolve(buildResponse(200, report));
  }

  return null;
}

module.exports = {
  resetUsageMockStore,
  usageMockRouter,
};
