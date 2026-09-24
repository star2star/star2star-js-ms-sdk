"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID } = require("./mockConstants");

const messagingStore = {
  conversations: new Map(),
  contextToConversation: new Map(),
  messages: new Map(),
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

function resetMessagingMockStore() {
  messagingStore.conversations.clear();
  messagingStore.contextToConversation.clear();
  messagingStore.messages.clear();
}

function createConversation(body) {
  const uuid = v4();
  const contextUuid = v4();
  const conv = {
    uuid,
    context: { uuid: contextUuid },
    phone_numbers: body?.phone_numbers || [],
    name: body?.name,
  };
  messagingStore.conversations.set(uuid, conv);
  messagingStore.contextToConversation.set(contextUuid, uuid);
  messagingStore.messages.set(uuid, []);
  return conv;
}

function conversationIdForMessageTarget(target) {
  return (
    messagingStore.contextToConversation.get(target) ||
    (messagingStore.conversations.has(target) ? target : null)
  );
}

function messagingMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/messaging/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  const userConversations = url.pathname.match(/^\/messaging\/users\/([^/]+)\/conversations$/);
  if (userConversations && method === "POST") {
    return readJsonBody(init).then((body) => {
      void userConversations;
      const conv = createConversation(body);
      return buildResponse(200, conv);
    });
  }

  if (userConversations && method === "GET") {
    const items = [...messagingStore.conversations.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const userMessages = url.pathname.match(/^\/messaging\/users\/([^/]+)\/messages$/);
  if (userMessages && method === "POST") {
    return readJsonBody(init).then((body) => {
      const convId = conversationIdForMessageTarget(body?.to);
      const message = { uuid: v4(), ...body };
      if (convId) {
        messagingStore.messages.get(convId).push(message);
      }
      return buildResponse(200, message);
    });
  }

  const convMessages = url.pathname.match(/^\/messaging\/conversations\/([^/]+)\/messages$/);
  if (convMessages && method === "GET") {
    const convId =
      messagingStore.contextToConversation.get(convMessages[1]) || convMessages[1];
    const items = messagingStore.messages.get(convId) || [];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const convGet = url.pathname.match(/^\/messaging\/conversations\/([^/]+)$/);
  if (convGet && method === "GET") {
    const conv =
      messagingStore.conversations.get(convGet[1]) ||
      messagingStore.conversations.get(
        messagingStore.contextToConversation.get(convGet[1])
      );
    return Promise.resolve(buildResponse(200, conv || { uuid: convGet[1] }));
  }

  if (convGet && method === "DELETE") {
    return Promise.resolve(buildResponse(204, null));
  }

  if (method === "POST" && url.pathname === "/messaging/conversations/remove") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  const markRead = url.pathname.match(/^\/messaging\/conversations\/([^/]+)\/messages\/modify$/);
  if (markRead && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  const snooze = url.pathname.match(/^\/messaging\/conversations\/([^/]+)\/modify$/);
  if (snooze && method === "POST") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, { uuid: snooze[1], snooze: body?.snooze })
    );
  }

  const archive = url.pathname.match(/^\/messaging\/conversations\/([^/]+)\/context\/modify$/);
  if (archive && method === "POST") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, { uuid: archive[1], archived: body?.archived })
    );
  }

  const deleteMsg = url.pathname.match(/^\/messaging\/messages\/([^/]+)$/);
  if (deleteMsg && method === "DELETE") {
    return Promise.resolve(buildResponse(204, null));
  }

  if (method === "POST" && url.pathname === "/messaging/messages/remove") {
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

module.exports = {
  resetMessagingMockStore,
  messagingMockRouter,
  messagingStore,
};
