"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const { ACCOUNT_UUID } = require("./mockConstants");

const campaignsStore = {
  brands: new Map(),
  campaigns: new Map(),
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

function resetCampaignsMockStore() {
  campaignsStore.brands.clear();
  campaignsStore.campaigns.clear();
  campaignsStore.brands.set(ACCOUNT_UUID, {
    account_uuid: ACCOUNT_UUID,
    brand_name: "Mock Brand",
    status: "active",
  });
}

function campaignsMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/sms/10dlc")) {
    return null;
  }

  if (method === "GET" && url.pathname === "/sms/10dlc/help/get_enumerations") {
    return Promise.resolve(
      buildResponse(200, {
        entity_types: ["PRIVATE"],
        verticals: ["TECHNOLOGY"],
        stock_exchanges: ["NASDAQ"],
      })
    );
  }

  const brandGet = url.pathname.match(/^\/sms\/10dlc\/customers\/([^/]+)$/);
  if (brandGet && method === "GET") {
    const brand = campaignsStore.brands.get(brandGet[1]) || {
      account_uuid: brandGet[1],
      brand_name: "Mock Brand",
    };
    return Promise.resolve(buildResponse(200, brand));
  }

  const usecases = url.pathname.match(/^\/sms\/10dlc\/customers\/([^/]+)\/usecases$/);
  if (usecases && method === "GET") {
    return Promise.resolve(
      buildResponse(200, [{ id: "LOW_VOLUME", name: "Low Volume" }])
    );
  }

  const listCampaigns = url.pathname.match(/^\/sms\/10dlc\/customers\/([^/]+)\/campaigns$/);
  if (listCampaigns && method === "GET") {
    const items = [...campaignsStore.campaigns.values()].filter(
      (c) => c.account_uuid === listCampaigns[1]
    );
    return Promise.resolve(
      buildResponse(200, {
        items: items.map((c) => ({
          campaign_id: c.campaign_id,
          display_name: c.display_name,
        })),
      })
    );
  }

  if (listCampaigns && method === "POST") {
    return readJsonBody(init).then((body) => {
      const campaignId = v4();
      const campaign = {
        ...body,
        campaign_id: campaignId,
        account_uuid: listCampaigns[1],
        display_name: body?.display_name || body?.displayName || "A Unit Test Campaign",
        description: body?.description || "",
      };
      campaignsStore.campaigns.set(campaignId, campaign);
      return buildResponse(200, { campaign_id: campaignId });
    });
  }

  const campaignGet = url.pathname.match(
    /^\/sms\/10dlc\/customers\/([^/]+)\/campaigns\/([^/]+)$/
  );
  if (campaignGet && method === "GET") {
    const campaign = campaignsStore.campaigns.get(campaignGet[2]);
    if (!campaign) {
      return Promise.resolve(errorResponse(404, "campaign not found"));
    }
    return Promise.resolve(buildResponse(200, campaign));
  }

  if (campaignGet && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = campaignsStore.campaigns.get(campaignGet[2]) || {
        campaign_id: campaignGet[2],
        account_uuid: campaignGet[1],
      };
      const updated = {
        ...existing,
        ...body,
        display_name: body?.displayName || body?.display_name || existing.display_name,
      };
      campaignsStore.campaigns.set(campaignGet[2], updated);
      return buildResponse(200, updated);
    });
  }

  if (campaignGet && method === "DELETE") {
    campaignsStore.campaigns.delete(campaignGet[2]);
    return Promise.resolve(buildResponse(200, { status: "success" }));
  }

  const assignNumbers = url.pathname.match(
    /^\/sms\/10dlc\/customers\/([^/]+)\/campaigns\/([^/]+)\/numbers\/assign$/
  );
  if (assignNumbers && method === "POST") {
    const campaign = campaignsStore.campaigns.get(assignNumbers[2]);
    return Promise.resolve(buildResponse(200, campaign || { status: "ok" }));
  }

  const unassignNumbers = url.pathname.match(
    /^\/sms\/10dlc\/customers\/([^/]+)\/campaigns\/([^/]+)\/numbers\/unassign$/
  );
  if (unassignNumbers && method === "POST") {
    const campaign = campaignsStore.campaigns.get(unassignNumbers[2]);
    return Promise.resolve(buildResponse(200, campaign || { status: "ok" }));
  }

  return null;
}

module.exports = {
  resetCampaignsMockStore,
  campaignsMockRouter,
};
