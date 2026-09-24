"use strict";

const { buildResponse } = require("./mockFetch");
const { genericMsMockRouter, resetGenericMsMockStore } = require("./genericMsMock");
const {
  resetWorkflowMockStore,
  workflowMockRouter,
} = require("../fixtures/workflowMockStore");
const { resetAuthMockStore, authMockRouter } = require("../fixtures/authMockStore");
const { resetObjectsMockStore, objectsMockRouter } = require("../fixtures/objectsMockStore");
const {
  resetCampaignsMockStore,
  campaignsMockRouter,
} = require("../fixtures/campaignsMockStore");
const {
  resetIdentityMockStore,
  identityMockRouter,
} = require("../fixtures/identityMockStore");
const { resetNumbersMockStore, numbersMockRouter } = require("../fixtures/numbersMockStore");
const { resetChatMockStore, chatMockRouter } = require("../fixtures/chatMockStore");
const { resetEmailMockStore, emailMockRouter } = require("../fixtures/emailMockStore");
const {
  resetEntitlementsMockStore,
  entitlementsMockRouter,
} = require("../fixtures/entitlementsMockStore");
const {
  resetActivityMockStore,
  activityMockRouter,
} = require("../fixtures/activityMockStore");
const {
  resetContactsMockStore,
  contactsMockRouter,
} = require("../fixtures/contactsMockStore");
const { resetDbsipMockStore, dbsipMockRouter } = require("../fixtures/dbsipMockStore");
const { resetMediaMockStore, mediaMockRouter } = require("../fixtures/mediaMockStore");
const { resetMobileMockStore, mobileMockRouter } = require("../fixtures/mobileMockStore");
const {
  resetProvidersMockStore,
  providersMockRouter,
} = require("../fixtures/providersMockStore");
const { resetPubsubMockStore, pubsubMockRouter } = require("../fixtures/pubsubMockStore");
const {
  resetResourcesMockStore,
  resourcesMockRouter,
} = require("../fixtures/resourcesMockStore");
const { resetUsageMockStore, usageMockRouter } = require("../fixtures/usageMockStore");
const {
  resetMessagingMockStore,
  messagingMockRouter,
} = require("../fixtures/messagingMockStore");
const {
  resetProfilesMockStore,
  profilesMockRouter,
} = require("../fixtures/profilesMockStore");
const { resetFormsMockStore, formsMockRouter } = require("../fixtures/formsMockStore");
const { MOCK_MS_HOST } = require("../fixtures/mockConstants");

const WORKFLOW_BASE = `${MOCK_MS_HOST}/workflow`;

function resetAllMockStores() {
  resetGenericMsMockStore();
  resetWorkflowMockStore();
  resetAuthMockStore();
  resetObjectsMockStore();
  resetCampaignsMockStore();
  resetIdentityMockStore();
  resetNumbersMockStore();
  resetChatMockStore();
  resetEmailMockStore();
  resetEntitlementsMockStore();
  resetActivityMockStore();
  resetContactsMockStore();
  resetDbsipMockStore();
  resetMediaMockStore();
  resetMobileMockStore();
  resetProvidersMockStore();
  resetPubsubMockStore();
  resetResourcesMockStore();
  resetUsageMockStore();
  resetMessagingMockStore();
  resetProfilesMockStore();
  resetFormsMockStore();
}

function msMockRouter(method, url, init) {
  if (url.href.startsWith(WORKFLOW_BASE) || url.pathname.startsWith("/workflow")) {
    return workflowMockRouter(method, url, init);
  }

  const auth = authMockRouter(method, url, init);
  if (auth) {
    return auth;
  }

  const identity = identityMockRouter(method, url, init);
  if (identity) {
    return identity;
  }

  const numbers = numbersMockRouter(method, url, init);
  if (numbers) {
    return numbers;
  }

  const messaging = messagingMockRouter(method, url, init);
  if (messaging) {
    return messaging;
  }

  const profiles = profilesMockRouter(method, url, init);
  if (profiles) {
    return profiles;
  }

  const forms = formsMockRouter(method, url, init);
  if (forms) {
    return forms;
  }

  const chat = chatMockRouter(method, url, init);
  if (chat) {
    return chat;
  }

  const email = emailMockRouter(method, url, init);
  if (email) {
    return email;
  }

  const entitlements = entitlementsMockRouter(method, url, init);
  if (entitlements) {
    return entitlements;
  }

  const activity = activityMockRouter(method, url, init);
  if (activity) {
    return activity;
  }

  const contacts = contactsMockRouter(method, url, init);
  if (contacts) {
    return contacts;
  }

  const dbsip = dbsipMockRouter(method, url, init);
  if (dbsip) {
    return dbsip;
  }

  const media = mediaMockRouter(method, url, init);
  if (media) {
    return media;
  }

  const mobile = mobileMockRouter(method, url, init);
  if (mobile) {
    return mobile;
  }

  const providers = providersMockRouter(method, url, init);
  if (providers) {
    return providers;
  }

  const pubsub = pubsubMockRouter(method, url, init);
  if (pubsub) {
    return pubsub;
  }

  const resources = resourcesMockRouter(method, url, init);
  if (resources) {
    return resources;
  }

  const usage = usageMockRouter(method, url, init);
  if (usage) {
    return usage;
  }

  const objects = objectsMockRouter(method, url, init);
  if (objects) {
    return objects;
  }

  const campaigns = campaignsMockRouter(method, url, init);
  if (campaigns) {
    return campaigns;
  }

  return genericMsMockRouter(method, url, init);
}

module.exports = {
  msMockRouter,
  resetAllMockStores,
};
