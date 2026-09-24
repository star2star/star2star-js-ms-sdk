"use strict";

const { buildResponse } = require("../helpers/mockFetch");
const { USER_UUID, ACCOUNT_UUID } = require("./mockConstants");

const entitlementsStore = {
  products: new Map(),
};

function errorResponse(code, message) {
  return buildResponse(code, {
    code,
    message,
    trace_id: "mock-trace-id",
    details: [],
  });
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

function filterProducts(items, qs) {
  const skip = new Set(["offset", "limit", "skip"]);
  let filtered = items;
  Object.keys(qs).forEach((key) => {
    if (skip.has(key)) {
      return;
    }
    filtered = filtered.filter((item) => String(item[key]) === String(qs[key]));
  });
  return filtered;
}

function seedProducts() {
  const seeds = [
    {
      uuid: "11111111-1111-1111-1111-111111111111",
      name: "Mock Product",
      active: true,
      application_uuid: "aee1083e-219f-41b3-9530-782752ade1d4",
      type: "cwa_curbside",
    },
    {
      uuid: "5fde27b7-68c5-4bfa-a8d8-0d8ff413b3a0",
      name: "Good Product",
      active: true,
      application_uuid: "aee1083e-219f-41b3-9530-782752ade1d4",
      type: "cwa_curbside",
    },
    {
      uuid: "08c5bb57-8a71-45a0-8f3f-1f6dd4c03373",
      name: "Updatable Product",
      active: true,
      application_uuid: "aee1083e-219f-41b3-9530-782752ade1d4",
      type: "cwa_curbside",
    },
  ];
  seeds.forEach((product) => entitlementsStore.products.set(product.uuid, { ...product }));
}

function resetEntitlementsMockStore() {
  entitlementsStore.products.clear();
  seedProducts();
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

function entitlementsMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/entitlements/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "GET" && url.pathname === "/entitlements/products") {
    const items = filterProducts([...entitlementsStore.products.values()], qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const productGet = url.pathname.match(/^\/entitlements\/products\/([^/]+)$/);
  if (productGet && method === "GET") {
    if (productGet[1] === "5fde27b7-68c5-4bfa-a8d8-0d8ff413b3a1") {
      return Promise.resolve(errorResponse(404, "product not found"));
    }
    const product = entitlementsStore.products.get(productGet[1]);
    if (!product) {
      return Promise.resolve(errorResponse(404, "product not found"));
    }
    return Promise.resolve(buildResponse(200, { ...product }));
  }

  if (productGet && method === "PUT") {
    const existing = entitlementsStore.products.get(productGet[1]);
    if (!existing) {
      return Promise.resolve(errorResponse(404, "product not found"));
    }
    return readJsonBody(init).then((body) => {
      const updated = { ...existing, ...(body || {}) };
      entitlementsStore.products.set(productGet[1], updated);
      return buildResponse(200, updated);
    });
  }

  const userEntitlements = url.pathname.match(/^\/entitlements\/users\/([^/]+)\/entitlements$/);
  if (userEntitlements && method === "GET") {
    return Promise.resolve(
      buildResponse(200, paginate([], qs))
    );
  }

  if (method === "POST" && url.pathname === "/entitlements/users/entitlements/bulk") {
    return readJsonBody(init).then((body) =>
      buildResponse(200, { status: "ok", items: body?.entitlements || [] })
    );
  }

  if (method === "DELETE" && url.pathname === "/entitlements/users/entitlements/bulk") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  const activate = url.pathname.match(
    /^\/entitlements\/users\/([^/]+)\/entitlements\/([^/]+)\/activate$/
  );
  if (activate && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "ok" }));
  }

  const disableProduct = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/products$/
  );
  if (disableProduct && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "accepted" }));
  }

  const disableProductType = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/product_types$/
  );
  if (disableProductType && method === "POST") {
    return Promise.resolve(buildResponse(200, { status: "accepted" }));
  }

  const enableProduct = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/products\/([^/]+)$/
  );
  if (enableProduct && method === "DELETE") {
    return Promise.resolve(buildResponse(200, { status: "accepted" }));
  }

  const enableProductType = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/product_types\/([^/]+)$/
  );
  if (enableProductType && method === "DELETE") {
    return Promise.resolve(buildResponse(200, { status: "accepted" }));
  }

  const listDisabledProducts = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/products$/
  );
  if (listDisabledProducts && method === "GET") {
    return Promise.resolve(buildResponse(200, paginate([], qs)));
  }

  const listDisabledProductTypes = url.pathname.match(
    /^\/entitlements\/accounts\/([^/]+)\/disable\/product_types$/
  );
  if (listDisabledProductTypes && method === "GET") {
    return Promise.resolve(buildResponse(200, paginate([], qs)));
  }

  const accountEntitlements = url.pathname.match(/^\/entitlements\/accounts\/([^/]+)\/entitlements$/);
  if (accountEntitlements && method === "GET") {
    let items = [
      {
        uuid: "ent-1",
        user_uuid: USER_UUID,
        account_uuid: ACCOUNT_UUID,
        product_uuid: "08c5bb57-8a71-45a0-8f3f-1f6dd4c03373",
      },
    ];
    if (qs.user_uuid) {
      items = items.filter((item) => item.user_uuid === qs.user_uuid);
    }
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  return null;
}

module.exports = {
  resetEntitlementsMockStore,
  entitlementsMockRouter,
};
