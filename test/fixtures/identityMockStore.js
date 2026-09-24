"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const {
  ACCOUNT_UUID,
  USER_UUID,
  MOCK_MS_HOST,
  identityFixture,
  newUuid,
} = require("./mockConstants");
const { removeUserFromAllGroups } = require("./authMockStore");

const identityStore = {
  identities: new Map(),
  deleted: new Set(),
};

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
      return undefined;
    }
  }
  return init.body;
}

function paginate(items, qs) {
  const offset = Number(qs.offset ?? qs.skip ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function filterIdentities(items, qs) {
  const skip = new Set(["offset", "limit", "skip", "include"]);
  let filtered = items.filter((item) => !identityStore.deleted.has(item.uuid));
  Object.keys(qs).forEach((key) => {
    if (skip.has(key)) {
      return;
    }
    const value = qs[key];
    filtered = filtered.filter((item) => {
      if (key === "username") {
        return (
          item.username === value ||
          item.email === value
        );
      }
      return String(item[key]) === String(value);
    });
  });
  return filtered;
}

function pendingLocation(uuid) {
  return `${MOCK_MS_HOST}/identity/pending/${uuid}`;
}

function seedPrimaryIdentity() {
  const base = identityFixture();
  const smsFrom = process.env.SMS_FROM;
  const aliases =
    smsFrom && String(smsFrom).length > 0
      ? [{ uuid: newUuid(), sms: `+1${smsFrom}` }]
      : [];
  identityStore.identities.set(USER_UUID, {
    ...base,
    uuid: USER_UUID,
    user_uuid: USER_UUID,
    username: base.email,
    aliases,
    properties: {},
    status: "Active",
  });
}

function getIdentityOrNull(uuid) {
  if (identityStore.deleted.has(uuid)) {
    return null;
  }
  return identityStore.identities.get(uuid) || null;
}

function identityDetailsResponse(record) {
  return {
    ...record,
    aliases: record.aliases || [],
    properties: record.properties || {},
  };
}

function resetIdentityMockStore() {
  identityStore.identities.clear();
  identityStore.deleted.clear();
  seedPrimaryIdentity();
}

function identityMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/identity/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "HEAD" && url.pathname.match(/^\/identity\/pending\//)) {
    return Promise.resolve(
      buildResponse(200, null, { headers: { "x-status": "complete" } })
    );
  }

  if (url.pathname === "/identity/users/me" && method === "GET") {
    const me = getIdentityOrNull(USER_UUID);
    return Promise.resolve(
      buildResponse(200, {
        user_uuid: USER_UUID,
        account_uuid: ACCOUNT_UUID,
        email: me?.email || identityFixture().email,
      })
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

  const createIdentity = url.pathname.match(/^\/identity\/accounts\/([^/]+)\/identities$/);
  if (createIdentity && method === "POST") {
    return readJsonBody(init).then((body) => {
      const uuid = newUuid();
      const record = {
        ...body,
        uuid,
        user_uuid: uuid,
        account_uuid: createIdentity[1],
        aliases: [],
        properties: {},
        status: body?.status || "Active",
      };
      identityStore.identities.set(uuid, record);
      return buildResponse(202, record, {
        headers: { location: pendingLocation(uuid) },
      });
    });
  }

  const accountIdentities = url.pathname.match(/^\/identity\/accounts\/([^/]+)\/identities$/);
  if (accountIdentities && method === "GET") {
    const items = [...identityStore.identities.values()].filter(
      (item) => item.account_uuid === accountIdentities[1]
    );
    return Promise.resolve(
      buildResponse(200, paginate(filterIdentities(items, qs), qs))
    );
  }

  if (url.pathname === "/identity/identities" && method === "GET") {
    const items = [...identityStore.identities.values()];
    return Promise.resolve(
      buildResponse(200, paginate(filterIdentities(items, qs), qs))
    );
  }

  const modifyMatch = url.pathname.match(/^\/identity\/identities\/([^/]+)\/modify$/);
  if (modifyMatch && method === "POST") {
    return readJsonBody(init).then((body) => {
      const existing = getIdentityOrNull(modifyMatch[1]);
      if (!existing) {
        return errorResponse(404, "identity not found");
      }
      const updated = { ...existing, ...(body || {}) };
      identityStore.identities.set(modifyMatch[1], updated);
      return buildResponse(200, updated);
    });
  }

  const aliasCreate = url.pathname.match(/^\/identity\/identities\/([^/]+)\/aliases$/);
  if (aliasCreate && method === "POST") {
    return readJsonBody(init).then((body) => {
      const existing = getIdentityOrNull(aliasCreate[1]);
      if (!existing) {
        return errorResponse(404, "identity not found");
      }
      const alias = { ...body, uuid: newUuid() };
      const aliases = [...(existing.aliases || []), alias];
      const updated = { ...existing, aliases };
      identityStore.identities.set(aliasCreate[1], updated);
      return buildResponse(201, null);
    });
  }

  const aliasDid = url.pathname.match(/^\/identity\/identities\/([^/]+)\/aliases\/([^/]+)$/);
  if (aliasDid && method === "PUT") {
    const userUuid = aliasDid[1];
    const did = aliasDid[2];
    const existing = getIdentityOrNull(userUuid);
    if (!existing) {
      return errorResponse(404, "identity not found");
    }
    const aliases = (existing.aliases || []).map((alias, index) =>
      index === 0 ? { ...alias, sms: did } : alias
    );
    if (aliases.length === 0) {
      aliases.push({ sms: did, uuid: newUuid() });
    }
    identityStore.identities.set(userUuid, { ...existing, aliases });
    return Promise.resolve(
      buildResponse(202, null, {
        headers: { location: pendingLocation(userUuid) },
      })
    );
  }

  const deactivate = url.pathname.match(/^\/identity\/identities\/([^/]+)\/deactivate$/);
  if (deactivate && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  const reactivate = url.pathname.match(/^\/identity\/identities\/([^/]+)\/reactivate$/);
  if (reactivate && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  const identityDelete = url.pathname.match(/^\/identity\/identities\/([^/]+)$/);
  if (identityDelete && method === "DELETE") {
    const uuid = identityDelete[1];
    identityStore.deleted.add(uuid);
    identityStore.identities.delete(uuid);
    removeUserFromAllGroups(uuid);
    return Promise.resolve(
      buildResponse(202, null, {
        headers: { location: pendingLocation(uuid) },
      })
    );
  }

  const identityGet = url.pathname.match(/^\/identity\/identities\/([^/]+)$/);
  if (identityGet && method === "GET") {
    const record = getIdentityOrNull(identityGet[1]);
    if (!record) {
      return Promise.resolve(errorResponse(404, "identity not found"));
    }
    return Promise.resolve(buildResponse(200, identityDetailsResponse(record)));
  }

  const mfaList = url.pathname.match(/^\/identity\/identities\/([^/]+)\/mfa$/);
  if (mfaList && method === "GET") {
    return Promise.resolve(
      buildResponse(200, {
        items: [{ type: "email", active: true, source: identityFixture().email }],
        metadata: { count: 1, total: 1, offset: 0, limit: 10 },
      })
    );
  }

  const mfaUpdate = url.pathname.match(/^\/identity\/identities\/([^/]+)\/mfa\/([^/]+)$/);
  if (mfaUpdate && method === "PUT") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, {
        type: mfaUpdate[2],
        active: body?.active === true,
        source: body?.source,
      })
    );
  }

  if (url.pathname === "/identity/users/password-tokens" && method === "POST") {
    return Promise.resolve(
      buildResponse(202, null, {
        headers: { location: pendingLocation(newUuid()) },
      })
    );
  }

  const passwordTokenGet = url.pathname.match(/^\/identity\/users\/password-tokens\/([^/]+)$/);
  if (passwordTokenGet && method === "GET") {
    return Promise.resolve(buildResponse(200, { email: null }));
  }

  if (passwordTokenGet && method === "PUT") {
    return Promise.resolve(errorResponse(404, "password token not found"));
  }

  return null;
}

module.exports = {
  resetIdentityMockStore,
  identityMockRouter,
};
