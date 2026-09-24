"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID, ACCOUNT_UUID } = require("./mockConstants");

const pubsubStore = {
  applications: new Map(),
  customEvents: new Map(),
  subscriptions: new Map(),
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

function resetPubsubMockStore() {
  pubsubStore.applications.clear();
  pubsubStore.customEvents.clear();
  pubsubStore.subscriptions.clear();
}

function pubsubMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/pubsub/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "POST" && url.pathname === "/pubsub/applications") {
    return readJsonBody(init).then((body) => {
      const app = {
        app_uuid: body?.app_uuid,
        app_name: body?.app_name,
        description: body?.description,
        events: body?.events || [],
        metadata: body?.metadata || {},
      };
      pubsubStore.applications.set(app.app_uuid, app);
      return buildResponse(200, app);
    });
  }

  if (method === "GET" && url.pathname === "/pubsub/applications") {
    const items = [...pubsubStore.applications.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const appGet = url.pathname.match(/^\/pubsub\/applications\/([^/]+)$/);
  if (appGet && method === "GET") {
    const app = pubsubStore.applications.get(appGet[1]);
    if (!app) {
      return Promise.resolve(buildResponse(404, { code: 404, message: "not found" }));
    }
    return Promise.resolve(buildResponse(200, { ...app }));
  }

  if (appGet && method === "DELETE") {
    pubsubStore.applications.delete(appGet[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  if (method === "POST" && url.pathname === "/pubsub/customevents") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const sub = {
        uuid,
        app_uuid: body?.app_uuid,
        events: body?.events || [],
        callback: body?.callback || {},
      };
      pubsubStore.customEvents.set(uuid, sub);
      return buildResponse(200, sub);
    });
  }

  if (method === "GET" && url.pathname === "/pubsub/customevents") {
    let items = [...pubsubStore.customEvents.values()];
    if (qs.appUUID) {
      items = items.filter((item) => item.app_uuid === qs.appUUID);
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const customEventGet = url.pathname.match(/^\/pubsub\/customevents\/([^/]+)$/);
  if (customEventGet && method === "GET") {
    const sub = pubsubStore.customEvents.get(customEventGet[1]);
    if (!sub) {
      return Promise.resolve(buildResponse(404, { code: 404, message: "not found" }));
    }
    return Promise.resolve(buildResponse(200, { ...sub }));
  }

  if (customEventGet && method === "DELETE") {
    pubsubStore.customEvents.delete(customEventGet[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  if (method === "POST" && url.pathname === "/pubsub/broadcasts/applications") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, { status: "ok", ...(body || {}) })
    );
  }

  if (method === "POST" && url.pathname === "/pubsub/subscriptions") {
    return readJsonBody(init).then((body) => {
      const subscription_uuid = v4();
      const sub = {
        subscription_uuid,
        ...body,
        user_uuid: body?.user_uuid || USER_UUID,
        account_uuid: body?.account_uuid || ACCOUNT_UUID,
      };
      pubsubStore.subscriptions.set(subscription_uuid, sub);
      return buildResponse(200, sub);
    });
  }

  if (method === "GET" && url.pathname === "/pubsub/subscriptions") {
    let items = [...pubsubStore.subscriptions.values()];
    if (qs.user_uuid) {
      items = items.filter((item) => item.user_uuid === qs.user_uuid);
    }
    if (qs.account_uuid) {
      items = items.filter((item) => item.account_uuid === qs.account_uuid);
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const subGet = url.pathname.match(/^\/pubsub\/subscriptions\/([^/]+)$/);
  if (subGet && method === "GET") {
    const sub = pubsubStore.subscriptions.get(subGet[1]) || { subscription_uuid: subGet[1] };
    return Promise.resolve(buildResponse(200, sub));
  }

  if (subGet && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = pubsubStore.subscriptions.get(subGet[1]) || {
        subscription_uuid: subGet[1],
      };
      const updated = {
        ...existing,
        ...(body || {}),
        expiration_date:
          body?.expiration_date ?? existing.expiration_date ?? new Date().toISOString(),
      };
      pubsubStore.subscriptions.set(subGet[1], updated);
      return buildResponse(200, updated);
    });
  }

  if (subGet && method === "DELETE") {
    pubsubStore.subscriptions.delete(subGet[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

module.exports = {
  resetPubsubMockStore,
  pubsubMockRouter,
};
