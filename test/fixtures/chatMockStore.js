"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const chatStore = {
  channels: new Map(),
  messages: new Map(),
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
  if (!init?.body) {
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
  const limit = Number(qs.limit || 100);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function resetChatMockStore() {
  chatStore.channels.clear();
  chatStore.messages.clear();
}

function getChannel(channelUUID) {
  return chatStore.channels.get(channelUUID);
}

function channelMessages(channelUUID) {
  if (!chatStore.messages.has(channelUUID)) {
    chatStore.messages.set(channelUUID, []);
  }
  return chatStore.messages.get(channelUUID);
}

function chatMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/chat/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "POST" && url.pathname === "/chat/channels") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const channel = {
        ...body,
        uuid,
        status: body?.status || "active",
        metadata: body?.metadata || {},
        members: body?.owner_uuid
          ? [{ uuid: body.owner_uuid, type: "user" }]
          : [],
      };
      chatStore.channels.set(uuid, channel);
      channelMessages(uuid);
      return buildResponse(200, channel);
    });
  }

  if (method === "GET" && url.pathname === "/chat/channels") {
    const items = [...chatStore.channels.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const channelInfo = url.pathname.match(/^\/chat\/channels\/([^/]+)\/info$/);
  if (channelInfo && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = getChannel(channelInfo[1]) || { uuid: channelInfo[1] };
      const updated = { ...existing, ...(body || {}) };
      chatStore.channels.set(channelInfo[1], updated);
      return buildResponse(200, updated);
    });
  }

  const channelMeta = url.pathname.match(/^\/chat\/channels\/([^/]+)\/meta$/);
  if (channelMeta && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = getChannel(channelMeta[1]) || { uuid: channelMeta[1], metadata: {} };
      const metadata = { ...(existing.metadata || {}), ...(body || {}) };
      const updated = { ...existing, metadata };
      chatStore.channels.set(channelMeta[1], updated);
      return buildResponse(200, updated);
    });
  }

  const channelGet = url.pathname.match(/^\/chat\/channels\/([^/]+)$/);
  if (channelGet && method === "GET") {
    const channel = getChannel(channelGet[1]);
    if (!channel) {
      return Promise.resolve(errorResponse(404, "channel not found"));
    }
    return Promise.resolve(buildResponse(200, channel));
  }

  const membersGet = url.pathname.match(/^\/chat\/channels\/([^/]+)\/members$/);
  if (membersGet && method === "GET") {
    const channel = getChannel(membersGet[1]);
    const items = channel?.members || [];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const memberPost = url.pathname.match(/^\/chat\/channels\/([^/]+)\/members$/);
  if (memberPost && method === "POST") {
    return readJsonBody(init).then((body) => {
      const channel = getChannel(memberPost[1]) || { uuid: memberPost[1], members: [] };
      const member = { uuid: body?.uuid, type: body?.type || "user" };
      const members = [...(channel.members || []), member];
      const updated = { ...channel, members };
      chatStore.channels.set(memberPost[1], updated);
      return buildResponse(200, member);
    });
  }

  const memberDelete = url.pathname.match(/^\/chat\/channels\/([^/]+)\/members\/([^/]+)$/);
  if (memberDelete && method === "DELETE") {
    const channel = getChannel(memberDelete[1]);
    if (channel) {
      channel.members = (channel.members || []).filter(
        (m) => m.uuid !== memberDelete[2]
      );
      chatStore.channels.set(memberDelete[1], channel);
    }
    return Promise.resolve(buildResponse(200, { uuid: memberDelete[2] }));
  }

  const messagesPost = url.pathname.match(/^\/chat\/channels\/([^/]+)\/messages$/);
  if (messagesPost && method === "POST") {
    return readJsonBody(init).then((body) => {
      const channelUUID = messagesPost[1];
      if (!body?.content) {
        return errorResponse(400, "invalid message");
      }
      const message = {
        uuid: v4(),
        channel_uuid: channelUUID,
        ...body,
      };
      channelMessages(channelUUID).push(message);
      if (body.user_uuid) {
        return buildResponse(200, body);
      }
      return buildResponse(200, { channel_uuid: channelUUID });
    });
  }

  const messagesGet = url.pathname.match(/^\/chat\/channels\/([^/]+)\/messages$/);
  if (messagesGet && method === "GET") {
    const items = channelMessages(messagesGet[1]);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  return null;
}

module.exports = {
  resetChatMockStore,
  chatMockRouter,
};
