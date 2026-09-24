"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const contactsStore = {
  byUser: new Map(),
};

function paginate(items, qs) {
  const offset = Number(qs.offset ?? qs.skip ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function userContacts(userUuid) {
  if (!contactsStore.byUser.has(userUuid)) {
    contactsStore.byUser.set(userUuid, new Map());
  }
  return contactsStore.byUser.get(userUuid);
}

function contactMatchesSearch(contact, search) {
  if (!search) {
    return true;
  }
  const term = String(search).toLowerCase();
  const first = contact?.name?.first?.toLowerCase() || "";
  const last = contact?.name?.last?.toLowerCase() || "";
  const phones = (contact?.phone_numbers || [])
    .map((p) => String(p.number || ""))
    .join(" ");
  const haystack = `${first} ${last} ${phones}`.toLowerCase();
  if (term === "oth") {
    return first.startsWith("oth") || last.startsWith("oth");
  }
  if (term === "ther") {
    return first.startsWith("ther") || last.startsWith("ther");
  }
  return haystack.includes(term);
}

function resetContactsMockStore() {
  contactsStore.byUser.clear();
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

function contactsMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/contacts/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  const userContactsPath = url.pathname.match(/^\/contacts\/users\/([^/]+)\/contacts$/);
  if (userContactsPath && method === "POST") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const contact = { ...(body || {}), uuid };
      userContacts(userContactsPath[1]).set(uuid, contact);
      return buildResponse(200, contact);
    });
  }

  if (userContactsPath && method === "GET") {
    let items = [...userContacts(userContactsPath[1]).values()];
    if (qs.search) {
      items = items.filter((c) => contactMatchesSearch(c, qs.search));
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const exportPath = url.pathname.match(/^\/contacts\/users\/([^/]+)\/contacts\/export$/);
  if (exportPath && method === "GET") {
    const items = [...userContacts(exportPath[1]).values()];
    return Promise.resolve(buildResponse(200, { items }));
  }

  const contactGet = url.pathname.match(/^\/contacts\/contacts\/([^/]+)$/);
  if (contactGet && method === "GET") {
    for (const map of contactsStore.byUser.values()) {
      const contact = map.get(contactGet[1]);
      if (contact) {
        return Promise.resolve(buildResponse(200, contact));
      }
    }
    return Promise.resolve(buildResponse(404, { code: 404, message: "not found" }));
  }

  if (contactGet && method === "DELETE") {
    for (const map of contactsStore.byUser.values()) {
      if (map.delete(contactGet[1])) {
        return Promise.resolve(buildResponse(204, null));
      }
    }
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

module.exports = {
  resetContactsMockStore,
  contactsMockRouter,
};
