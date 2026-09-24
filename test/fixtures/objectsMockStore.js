"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID } = require("./mockConstants");

const objectsStore = {
  byId: new Map(),
  byUser: new Map(),
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
    return JSON.parse(init.body);
  }
  return init.body;
}

function paginate(items, qs) {
  const offset = Number(qs.offset ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function filterItems(items, qs) {
  const skip = new Set(["offset", "limit", "load_content", "aggregate", "sort"]);
  const keys = Object.keys(qs).filter((k) => !skip.has(k));
  if (keys.length === 0) {
    return items;
  }
  return items.filter((item) =>
    keys.every((key) => String(item[key]) === String(qs[key]))
  );
}

function resetObjectsMockStore() {
  objectsStore.byId.clear();
  objectsStore.byUser.clear();
}

function saveObject(userUuid, obj) {
  objectsStore.byId.set(obj.uuid, obj);
  const list = objectsStore.byUser.get(userUuid) || [];
  const idx = list.findIndex((o) => o.uuid === obj.uuid);
  if (idx >= 0) {
    list[idx] = obj;
  } else {
    list.push(obj);
  }
  objectsStore.byUser.set(userUuid, list);
}

function objectsMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/objects/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (url.pathname === "/objects/objects" && method === "POST") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const obj = {
        ...body,
        uuid,
        status: "active",
        content: body?.content || {},
      };
      objectsStore.byId.set(uuid, obj);
      return buildResponse(200, obj);
    });
  }

  const createUserObj = url.pathname.match(/^\/objects\/users\/([^/]+)\/objects$/);
  if (createUserObj && method === "POST") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const obj = {
        ...body,
        uuid,
        status: "active",
        content: body?.content || {},
      };
      saveObject(createUserObj[1], obj);
      return buildResponse(200, obj);
    });
  }

  const listAllowed = url.pathname.match(/^\/objects\/users\/([^/]+)\/allowed-objects$/);
  if (listAllowed && method === "GET") {
    let items = [...(objectsStore.byUser.get(listAllowed[1]) || [])];
    items = filterItems(items, qs);
    if (qs.load_content === "true" || qs.load_content === true) {
      items = items.map((item) => ({
        ...item,
        content: objectsStore.byId.get(item.uuid)?.content || item.content,
      }));
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const getObj = url.pathname.match(/^\/objects\/objects\/([^/]+)$/);
  if (getObj && method === "GET") {
    const obj = objectsStore.byId.get(getObj[1]);
    if (!obj) {
      return Promise.resolve(errorResponse(404, "object not found"));
    }
    return Promise.resolve(buildResponse(200, obj));
  }

  if (getObj && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = objectsStore.byId.get(getObj[1]) || { uuid: getObj[1] };
      const updated = { ...existing, ...body, uuid: getObj[1] };
      objectsStore.byId.set(getObj[1], updated);
      objectsStore.byUser.forEach((list, userUuid) => {
        const idx = list.findIndex((o) => o.uuid === getObj[1]);
        if (idx >= 0) {
          list[idx] = updated;
          objectsStore.byUser.set(userUuid, list);
        }
      });
      return buildResponse(200, updated);
    });
  }

  if (getObj && method === "DELETE") {
    objectsStore.byId.delete(getObj[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  const byType = url.pathname.match(/^\/objects\/users\/([^/]+)\/objects\/type\/([^/]+)$/);
  if (byType && method === "GET") {
    const items = (objectsStore.byUser.get(byType[1]) || []).filter(
      (o) => o.type === byType[2]
    );
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const byTypeName = url.pathname.match(
    /^\/objects\/users\/([^/]+)\/objects\/type\/([^/]+)\/name\/([^/]+)$/
  );
  if (byTypeName && method === "GET") {
    const obj = (objectsStore.byUser.get(byTypeName[1]) || []).find(
      (o) => o.type === byTypeName[2] && o.name === decodeURIComponent(byTypeName[3])
    );
    if (!obj) {
      return Promise.resolve(errorResponse(404, "object not found"));
    }
    return Promise.resolve(buildResponse(200, obj));
  }

  return null;
}

module.exports = {
  resetObjectsMockStore,
  objectsMockRouter,
  objectsStore,
};
