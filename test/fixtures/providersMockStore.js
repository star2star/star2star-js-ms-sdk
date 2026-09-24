"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID } = require("./mockConstants");

const providersStore = {
  connectionUuid: v4(),
  providerUuid: v4(),
  policyUuid: v4(),
};

function resetProvidersMockStore() {
  providersStore.connectionUuid = v4();
  providersStore.providerUuid = v4();
  providersStore.policyUuid = v4();
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

function providersMockRouter(method, url) {
  if (!url.pathname.startsWith("/providers/")) {
    return null;
  }

  const profiles = url.pathname.match(/^\/providers\/users\/([^/]+)\/profiles$/);
  if (profiles && method === "GET") {
    return Promise.resolve(
      buildResponse(200, paginate([{ uuid: v4(), user_uuid: profiles[1], name: "mock-profile" }], {}))
    );
  }

  const tokenByPolicy = url.pathname.match(/^\/providers\/providers\/([^/]+)\/oauth\/token$/);
  if (tokenByPolicy && method === "GET") {
    return Promise.resolve(buildResponse(200, { access_token: "mock-provider-access-token" }));
  }

  if (method === "GET" && url.pathname === "/providers/providers") {
    return Promise.resolve(
      buildResponse(200, paginate([{ uuid: providersStore.providerUuid, name: "Google", type: "identity" }], {}))
    );
  }

  const userProviders = url.pathname.match(/^\/providers\/users\/([^/]+)\/providers$/);
  if (userProviders && method === "GET") {
    return Promise.resolve(buildResponse(200, paginate([], {})));
  }

  const connections = url.pathname.match(/^\/providers\/users\/([^/]+)\/connections$/);
  if (connections && method === "GET") {
    return Promise.resolve(
      buildResponse(200, paginate([
        {
          uuid: providersStore.connectionUuid,
          provider_uuid: providersStore.providerUuid,
          policy_uuid: providersStore.policyUuid,
          user_uuid: USER_UUID,
          user_name: "mock.user@test.example",
        },
      ], {}))
    );
  }

  const tokenByConnection = url.pathname.match(/^\/providers\/users\/connections\/([^/]+)\/oauth\/token$/);
  if (tokenByConnection && method === "GET") {
    return Promise.resolve(buildResponse(200, { access_token: "mock-provider-access-token" }));
  }

  return null;
}

module.exports = {
  resetProvidersMockStore,
  providersMockRouter,
};
