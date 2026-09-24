"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID } = require("./mockConstants");

const mediaStore = {
  files: new Map(),
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

function resetMediaMockStore() {
  mediaStore.files.clear();
}

function mediaMockRouter(method, url) {
  if (!url.pathname.startsWith("/media/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "GET" && url.pathname === "/media/media") {
    const items = [...mediaStore.files.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "POST" && url.pathname === "/media/media") {
    const file_id = v4();
    const file = {
      file_id,
      uuid: file_id,
      file_name: "git-cheat-sheet.png",
      status: "complete",
      url: `https://mock-ms.test/media/${file_id}`,
    };
    mediaStore.files.set(file_id, file);
    return Promise.resolve(buildResponse(200, file));
  }

  const fileById = url.pathname.match(/^\/media\/media\/([^/]+)$/);
  if (fileById && method === "GET") {
    const file = mediaStore.files.get(fileById[1]) || {
      uuid: fileById[1],
      file_id: fileById[1],
      url: `https://mock-ms.test/media/${fileById[1]}`,
    };
    return Promise.resolve(buildResponse(200, file));
  }

  if (fileById && method === "DELETE") {
    mediaStore.files.delete(fileById[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  const share = url.pathname.match(/^\/media\/media\/([^/]+)\/share$/);
  if (share && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  const userMedia = url.pathname.match(/^\/media\/users\/([^/]+)\/media$/);
  if (userMedia && method === "GET") {
    void userMedia;
    const items = [...mediaStore.files.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (userMedia && method === "POST") {
    const file_id = v4();
    const file = { file_id, uuid: file_id, user_uuid: USER_UUID };
    mediaStore.files.set(file_id, file);
    return Promise.resolve(buildResponse(200, file));
  }

  return null;
}

module.exports = {
  resetMediaMockStore,
  mediaMockRouter,
};
