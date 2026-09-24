"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("./mockFetch");
const {
  ACCOUNT_UUID,
  ADMIN_GROUP_UUID,
  USER_GROUP_UUID,
  USER_UUID,
  identityFixture,
  MOCK_AUTH_HOST,
  newUuid,
} = require("../fixtures/mockConstants");

const store = {
  accounts: new Map(),
  resources: new Map(),
  lists: new Map(),
};

const PAGINATION_KEYS = new Set([
  "offset",
  "limit",
  "skip",
  "expand",
  "include",
  "aggregate",
  "short",
  "default",
]);

function errorResponse(code, message) {
  return buildResponse(code, {
    code,
    message,
    trace_id: "mock-trace-id",
    details: [],
  });
}

async function readJsonBody(init) {
  if (!init.body) {
    return undefined;
  }
  if (typeof init.body === "string") {
    if (!init.body.trim()) {
      return undefined;
    }
    try {
      return JSON.parse(init.body);
    } catch {
      return init.body;
    }
  }
  return init.body;
}

function readFormBody(init) {
  if (!init.body) {
    return {};
  }
  if (init.body instanceof URLSearchParams) {
    return Object.fromEntries(init.body);
  }
  if (typeof init.body === "string") {
    try {
      return Object.fromEntries(new URLSearchParams(init.body));
    } catch {
      return {};
    }
  }
  return {};
}

function deepMerge(target, patch) {
  const out = { ...target };
  Object.keys(patch || {}).forEach((key) => {
    if (
      patch[key] &&
      typeof patch[key] === "object" &&
      !Array.isArray(patch[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], patch[key]);
    } else {
      out[key] = patch[key];
    }
  });
  return out;
}

function paginate(items, qs) {
  const offset = Number(qs.offset ?? qs.skip ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: {
      count: slice.length,
      total: items.length,
      offset,
      limit,
    },
  };
}

function filterItems(items, qs) {
  const filters = Object.keys(qs).filter((k) => !PAGINATION_KEYS.has(k));
  if (filters.length === 0) {
    return items;
  }
  return items.filter((item) =>
    filters.every((key) => {
      if (item[key] === undefined) {
        return true;
      }
      return String(item[key]) === String(qs[key]);
    })
  );
}

function listKeyForCollection(pathname) {
  if (pathname.includes("/user-groups")) {
    return "/auth/user-groups";
  }
  if (pathname.endsWith("/roles") || pathname.includes("/roles/")) {
    return "/auth/roles";
  }
  if (pathname.endsWith("/permissions")) {
    return "/auth/permissions";
  }
  if (pathname.startsWith("/lambda/actions")) {
    return "/lambda/actions";
  }
  if (pathname === "/scheduler/events" || pathname.startsWith("/scheduler/")) {
    return "/scheduler/events";
  }
  if (pathname.startsWith("/shorturl")) {
    return "/shorturl/urls";
  }
  return pathname;
}

function appendToList(key, item) {
  const list = store.lists.get(key) || [];
  list.push(item);
  store.lists.set(key, list);
}

function seedDefaults() {
  store.accounts.clear();
  store.resources.clear();
  store.lists.clear();

  const customer = {
    uuid: ACCOUNT_UUID,
    name: "Mock Customer",
    type: "Customer",
    status: "Active",
    relationships: {
      items: [{ source: { uuid: ACCOUNT_UUID }, target: { uuid: newUuid() } }],
    },
  };
  store.accounts.set(ACCOUNT_UUID, customer);
  store.lists.set("accounts:Customer", [customer]);

  store.lists.set("metadata:subsystems", [
    { name: "voice-api", subsystem: "voice-api" },
    { name: "accounts-api", subsystem: "accounts-api" },
    { name: "workflow-api", subsystem: "workflow-api" },
  ]);

  const permissionUuid = newUuid();
  appendToList("/auth/permissions", {
    uuid: permissionUuid,
    name: "mock-permission",
    resource_type: "account",
  });

  appendToList("/lambda/actions", { name: "sumnumbers", uuid: newUuid() });

  appendToList("/activity/report/template", {
    name: "Appt Conf Response",
    template_uuid: newUuid(),
    uuid: newUuid(),
  });

  appendToList("/oauth/scopes", { name: "default", uuid: newUuid() });
}

function resetGenericMsMockStore() {
  seedDefaults();
}

function enrichPostPayload(pathname, body, url) {
  const uuid = (body && body.uuid) || newUuid();
  let payload =
    body && typeof body === "object"
      ? { ...body, uuid, status: body.status || "active" }
      : { uuid, status: "ok" };

  const accountGroups = pathname.match(/^\/auth\/accounts\/([^/]+)\/user-groups$/);
  if (accountGroups && body) {
    payload.account_uuid = accountGroups[1];
    if (Array.isArray(body.users)) {
      payload.members = body.users.map((userUuid) => ({ uuid: userUuid }));
    }
  }

  const accountRoles = pathname.match(/^\/auth\/accounts\/([^/]+)\/roles$/);
  if (accountRoles && body) {
    payload.account_uuid = accountRoles[1];
  }

  if (pathname.includes("/shorturl")) {
    payload.short_code = payload.short_code || "mockShort";
    payload.short_url_link = `https://mock.short/${payload.short_code}`;
    payload.url = payload.url || body?.url;
  }

  if (pathname === "/oauth/clients" && body) {
    payload.public_id = newUuid();
    payload.secret = newUuid();
    payload.application_type = body.application_type || "connect";
    payload.name = body.name || "Unit-Test";
  }

  if (pathname.startsWith("/scheduler/")) {
    payload.user_uuid = payload.user_uuid || USER_UUID;
    payload.timezone = payload.timezone || "America/New_York";
    payload.frequency = payload.frequency || { type: "once" };
    payload.trigger = payload.trigger || {};
    payload.metadata = payload.metadata || {};
  }

  if (pathname.includes("/email/") || pathname.includes("/messages/send")) {
    return { status: "ok", message_id: newUuid() };
  }

  return payload;
}

function handleOAuth(method, url, init) {
  const oauthPath = url.pathname.startsWith("/oauth");

  if (method === "POST" && url.pathname === "/oauth/token") {
    const form = readFormBody(init);
    const token = newUuid();
    if (form.grant_type === "client_credentials") {
      return Promise.resolve(
        buildResponse(200, {
          access_token: token,
          token_type: "bearer",
          expires_in: 3600,
        })
      );
    }
    if (form.grant_type === "refresh_token") {
      return Promise.resolve(
        buildResponse(200, {
          access_token: token,
          refresh_token: newUuid(),
          expires_in: 3600,
          token_type: "Bearer",
        })
      );
    }
    if (form.password === "bad-password-for-mock-test") {
      return Promise.resolve(errorResponse(401, "invalid credentials"));
    }
    return Promise.resolve(
      buildResponse(200, {
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: newUuid(),
      })
    );
  }

  if (
    method === "POST" &&
    (url.pathname === "/oauth/invalidate/access" ||
      url.pathname === "/oauth/validate/access")
  ) {
    return Promise.resolve(buildResponse(204, null));
  }

  if (oauthPath && method === "GET" && url.pathname === "/oauth/scopes") {
    const items = store.lists.get("/oauth/scopes") || [];
    return Promise.resolve(buildResponse(200, { items }));
  }

  if (oauthPath && method === "GET" && url.pathname === "/oauth/oauth/tokens") {
    return Promise.resolve(
      buildResponse(200, paginate([{ access_token: newUuid(), token_type: "client" }], Object.fromEntries(url.searchParams)))
    );
  }

  if (oauthPath && method === "POST" && url.pathname.match(/^\/oauth\/clients\/[^/]+\/scopes$/)) {
    return Promise.resolve(buildResponse(204, null));
  }

  if (oauthPath && method === "POST" && url.pathname === "/oauth/clients") {
    return readJsonBody(init).then((body) => {
      const payload = enrichPostPayload(url.pathname, body, url);
      appendToList("/oauth/clients", payload);
      return buildResponse(200, payload);
    });
  }

  if (oauthPath && method === "GET" && url.pathname === "/oauth/clients") {
    const items = store.lists.get("/oauth/clients") || [];
    const qs = Object.fromEntries(url.searchParams.entries());
    return Promise.resolve(buildResponse(200, paginate(filterItems(items, qs), qs)));
  }

  return null;
}

function handleIdentity(method, url, init) {
  if (url.pathname === "/identity/users/me" && method === "GET") {
    return Promise.resolve(
      buildResponse(200, { user_uuid: USER_UUID, account_uuid: ACCOUNT_UUID })
    );
  }

  if (url.pathname === "/identity/users/login" && method === "POST") {
    return readJsonBody(init).then((body) => {
      if (body && (body.password === "bad" || body.password === "definitely-wrong-password")) {
        return errorResponse(401, "invalid login");
      }
      return buildResponse(200, { access_token: newUuid(), user_uuid: USER_UUID });
    });
  }

  const identityMatch = url.pathname.match(/^\/identity\/identities\/([^/?]+)/);
  if (identityMatch && method === "GET") {
    const base = identityFixture();
    return Promise.resolve(buildResponse(200, { ...base, uuid: identityMatch[1] }));
  }

  if (identityMatch && (method === "PUT" || method === "POST")) {
    return readJsonBody(init).then((body) => {
      const merged = { ...identityFixture(), uuid: identityMatch[1], ...(body || {}) };
      store.resources.set(`GET:${url.pathname}`, merged);
      return buildResponse(200, merged);
    });
  }

  if (url.pathname.includes("/aliases") && method === "POST") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, { ...body, uuid: newUuid(), did: body?.did || "+15551234567" })
    );
  }

  if (url.pathname.includes("/deactivate") && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  if (url.pathname.includes("/reactivate") && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  if (url.pathname.includes("/password-tokens") && method === "POST") {
    return Promise.resolve(buildResponse(200, { token: newUuid(), status: "ok" }));
  }

  if (url.pathname.includes("/password-tokens") && method === "GET") {
    return Promise.resolve(buildResponse(200, { valid: true, status: "ok" }));
  }

  if (url.pathname === "/identity/identities" && method === "GET") {
    const qs = Object.fromEntries(url.searchParams.entries());
    const items = [{ ...identityFixture(), uuid: USER_UUID }];
    return Promise.resolve(buildResponse(200, paginate(filterItems(items, qs), qs)));
  }

  return null;
}

function handleMetadata(method, url, qs) {
  if (method === "GET" && url.pathname === "/metadata/subsystems") {
    let items = store.lists.get("metadata:subsystems") || [];
    if (qs.subsystems) {
      const wanted = qs.subsystems.split(",").map((s) => s.trim());
      items = items.filter((item) => wanted.includes(item.subsystem || item.name));
    }
    return Promise.resolve(buildResponse(200, { items }));
  }
  return null;
}

function handleAuth(method, url, qs, init) {
  const defaultGroups = url.pathname.match(
    /^\/auth\/accounts\/([^/]+)\/user-groups$/
  );
  if (defaultGroups && method === "GET" && qs.default === "true") {
    return Promise.resolve(
      buildResponse(200, {
        items: [
          { uuid: ADMIN_GROUP_UUID, type: "admin", name: "Admin" },
          { uuid: USER_GROUP_UUID, type: "user", name: "User" },
        ],
        metadata: { count: 2, total: 2, offset: 0, limit: 10 },
      })
    );
  }

  if (method === "GET" && url.pathname === "/auth/user-groups") {
    let items = store.lists.get("/auth/user-groups") || [];
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "GET" && url.pathname === "/auth/roles") {
    let items = (store.lists.get("/auth/roles") || []).map((role) => ({
      ...role,
      type: role.type || "role_permission",
    }));
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "GET" && url.pathname === "/auth/permissions") {
    let items = store.lists.get("/auth/permissions") || [];
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const roleById = url.pathname.match(/^\/auth\/roles\/([^/]+)$/);
  if (roleById && method === "GET") {
    const items = store.lists.get("/auth/roles") || [];
    const found = items.find((r) => r.uuid === roleById[1]);
    return Promise.resolve(buildResponse(200, found || { uuid: roleById[1], name: "Unit-Test" }));
  }

  const modifyGroup = url.pathname.match(/^\/auth\/user-groups\/([^/]+)$/);
  if (modifyGroup && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const list = store.lists.get("/auth/user-groups") || [];
      const idx = list.findIndex((g) => g.uuid === modifyGroup[1]);
      const updated = { ...(list[idx] || { uuid: modifyGroup[1] }), ...(body || {}) };
      if (idx >= 0) {
        list[idx] = updated;
      } else {
        list.push(updated);
      }
      store.lists.set("/auth/user-groups", list);
      store.resources.set(`GET:${url.pathname}`, updated);
      return buildResponse(200, updated);
    });
  }

  if (url.pathname.includes("/deactivate") && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  if (url.pathname.includes("/activate") && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  if (url.pathname.startsWith("/auth/") && (method === "POST" || method === "PATCH")) {
    const isCreate = url.pathname.match(/\/accounts\/[^/]+\/(user-groups|roles)$/);
    if (!isCreate) {
      return Promise.resolve(buildResponse(204, null));
    }
  }

  if (method === "DELETE") {
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

function assignContactUuids(contacts) {
  if (!Array.isArray(contacts)) {
    return contacts;
  }
  return contacts.map((c) => ({
    ...c,
    uuid: c.uuid || newUuid(),
  }));
}

function handleAccounts(method, url, init, qs) {
  if (url.pathname === "/accounts/accounts" && method === "POST") {
    return readJsonBody(init).then((body) => {
      if (!body || typeof body !== "object") {
        return errorResponse(400, "account body required");
      }
      if (!body.parent_uuid && body.type !== "Customer") {
        return errorResponse(400, "parent_uuid required");
      }
      const uuid = newUuid();
      const account = {
        ...body,
        uuid,
        contacts: assignContactUuids(body.contacts),
        relationships: {
          items: [{ source: { uuid }, target: { uuid: body.parent_uuid || ACCOUNT_UUID } }],
        },
      };
      store.accounts.set(uuid, account);
      return buildResponse(200, account);
    });
  }

  const accountGet = url.pathname.match(/^\/accounts\/accounts\/([^/]+)$/);
  if (accountGet && method === "GET") {
    const id = accountGet[1];
    const account = store.accounts.get(id);
    if (!account) {
      return Promise.resolve(errorResponse(404, "account not found"));
    }
    const expand = qs.expand;
    const payload = { ...account };
    if (expand && expand.includes("relationship")) {
      payload.relationships = account.relationships || {
        items: [{ source: { uuid: id } }],
      };
    }
    return Promise.resolve(buildResponse(200, payload));
  }

  if (url.pathname === "/accounts/accounts" && method === "GET") {
    let items = [...store.accounts.values()];
    if (qs.type) {
      items = items.filter((a) => a.type === qs.type);
    }
    if (items.length === 0 && qs.type === "Customer") {
      items = store.lists.get("accounts:Customer") || [];
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const accountModify = url.pathname.match(/^\/accounts\/accounts\/([^/]+)$/);
  if (accountModify && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const id = accountModify[1];
      const existing = store.accounts.get(id) || { uuid: id };
      const merged = deepMerge(existing, body || {});
      store.accounts.set(id, merged);
      return buildResponse(200, merged);
    });
  }

  const relationships = url.pathname.match(
    /^\/accounts\/accounts\/([^/]+)\/relationships$/
  );
  if (relationships && method === "GET") {
    return Promise.resolve(buildResponse(200, paginate([], qs)));
  }

  const suspend = url.pathname.match(/^\/accounts\/accounts\/([^/]+)\/suspend$/);
  if (suspend && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  const reinstate = url.pathname.match(/^\/accounts\/accounts\/([^/]+)\/reinstate$/);
  if (reinstate && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  const accountDelete = url.pathname.match(/^\/accounts\/accounts\/([^/]+)$/);
  if (accountDelete && method === "DELETE") {
    store.accounts.delete(accountDelete[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

function handleLambda(method, url, init) {
  if (method === "GET" && url.pathname === "/lambda/actions") {
    const qs = Object.fromEntries(url.searchParams.entries());
    const items = store.lists.get("/lambda/actions") || [];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const invoke = url.pathname.match(/^\/lambda\/actions\/([^/]+)\/invoke$/);
  if (invoke && method === "POST") {
    const actionName = decodeURIComponent(invoke[1]);
    if (actionName.includes("does not exist")) {
      return Promise.resolve(errorResponse(404, "lambda not found"));
    }
    return readJsonBody(init).then((body) => {
      if (invoke[1] === "sumnumbers" && body && Array.isArray(body.nbrs)) {
        const sum = body.nbrs.reduce((a, b) => a + b, 0);
        return buildResponse(200, { body: { sum } });
      }
      return buildResponse(200, { body: body || {} });
    });
  }

  return null;
}

function resourceKey(method, pathname) {
  return `${method}:${pathname}`;
}

function handleGeneric(method, url, init, qs) {
  if (method === "HEAD") {
    return Promise.resolve(
      buildResponse(200, null, { headers: { "x-status": "complete" } })
    );
  }

  const stored = store.resources.get(resourceKey(method, url.pathname));
  if (stored) {
    return Promise.resolve(buildResponse(200, stored));
  }

  if (method === "GET") {
    const collectionKey = listKeyForCollection(url.pathname);
    let items =
      store.lists.get(collectionKey) ||
      store.lists.get(url.pathname);

    if (!items && url.pathname.includes("/report/template")) {
      items = store.lists.get("/activity/report/template") || [];
    }

    if (items) {
      items = filterItems(items, qs);
      if (
        Object.prototype.hasOwnProperty.call(qs, "offset") ||
        Object.prototype.hasOwnProperty.call(qs, "limit") ||
        Object.prototype.hasOwnProperty.call(qs, "skip")
      ) {
        return Promise.resolve(buildResponse(200, paginate(items, qs)));
      }
      return Promise.resolve(buildResponse(200, { items, metadata: paginate(items, qs).metadata }));
    }

    const idMatch = url.pathname.match(/\/([0-9a-f-]{36})$/i);
    if (idMatch) {
      const byId = store.resources.get(resourceKey("GET", url.pathname));
      if (byId) {
        return Promise.resolve(buildResponse(200, byId));
      }
      return Promise.resolve(
        buildResponse(200, { uuid: idMatch[1], status: "active", name: "mock-resource" })
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(qs, "offset") ||
      Object.prototype.hasOwnProperty.call(qs, "limit")
    ) {
      return Promise.resolve(buildResponse(200, paginate([], qs)));
    }

    return Promise.resolve(
      buildResponse(200, { items: [], metadata: { count: 0, total: 0, offset: 0, limit: 10 } })
    );
  }

  if (method === "POST") {
    return readJsonBody(init).then((body) => {
      const payload = enrichPostPayload(url.pathname, body, url);
      store.resources.set(resourceKey("GET", `${url.pathname}/${payload.uuid}`), payload);
      const collectionKey = listKeyForCollection(url.pathname);
      appendToList(collectionKey, payload);
      appendToList(url.pathname, payload);
      return buildResponse(200, payload);
    });
  }

  if (method === "PUT" || method === "PATCH") {
    return readJsonBody(init).then((body) => {
      const existing = store.resources.get(resourceKey("GET", url.pathname)) || {};
      const payload = deepMerge(existing, body || {});
      if (!payload.uuid) {
        const idMatch = url.pathname.match(/\/([0-9a-f-]{36})$/i);
        payload.uuid = idMatch ? idMatch[1] : newUuid();
      }
      store.resources.set(resourceKey("GET", url.pathname), payload);
      return buildResponse(200, payload);
    });
  }

  if (method === "DELETE") {
    return Promise.resolve(buildResponse(204, null));
  }

  return Promise.resolve(errorResponse(404, `unmocked ${method} ${url.pathname}`));
}

function genericMsMockRouter(method, url, init) {
  const qs = Object.fromEntries(url.searchParams.entries());

  const onAuthHost = url.origin === new URL(MOCK_AUTH_HOST).origin;
  if (onAuthHost || url.pathname.startsWith("/oauth")) {
    const oauth = handleOAuth(method, url, init);
    if (oauth) {
      return oauth;
    }
  }

  const metadata = handleMetadata(method, url, qs);
  if (metadata) {
    return metadata;
  }

  const accounts = handleAccounts(method, url, init, qs);
  if (accounts) {
    return accounts;
  }

  const lambda = handleLambda(method, url, init);
  if (lambda) {
    return lambda;
  }

  return handleGeneric(method, url, init, qs);
}

module.exports = {
  resetGenericMsMockStore,
  genericMsMockRouter,
};
