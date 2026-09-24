"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const activityStore = {
  templates: new Map(),
  reports: new Map(),
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

function seedActivity() {
  const templateUuid = v4();
  activityStore.templates.set(templateUuid, {
    name: "Appt Conf Response",
    template_uuid: templateUuid,
    uuid: v4(),
  });
  activityStore.registerTypes = [{ name: "voicemail", type: "activity" }];
  activityStore.registerSubtypes = [{ name: "cwa_urgent_history", type: "subtype" }];
}

function resetActivityMockStore() {
  activityStore.templates.clear();
  activityStore.reports.clear();
  seedActivity();
}

function activityMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/activity/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "GET" && url.pathname === "/activity/report/template") {
    const items = [...activityStore.templates.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "POST" && url.pathname === "/activity/report/template") {
    return readJsonBody(init).then((body) => {
      const template_uuid = v4();
      const template = { ...(body || {}), template_uuid, uuid: v4() };
      activityStore.templates.set(template_uuid, template);
      return buildResponse(200, template);
    });
  }

  const updateTemplate = url.pathname.match(/^\/activity\/report\/template\/([^/]+)$/);
  if (updateTemplate && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const existing = activityStore.templates.get(updateTemplate[1]) || {
        template_uuid: updateTemplate[1],
      };
      const updated = { ...existing, ...(body || {}) };
      activityStore.templates.set(updateTemplate[1], updated);
      return buildResponse(200, updated);
    });
  }

  if (updateTemplate && method === "DELETE") {
    activityStore.templates.delete(updateTemplate[1]);
    return Promise.resolve(buildResponse(200, {}));
  }

  const runReport = url.pathname.match(/^\/activity\/report\/([^/]+)$/);
  if (runReport && method === "POST") {
    const report_uuid = v4();
    const report = {
      template_uuid: runReport[1],
      report_uuid,
      status: "complete",
    };
    activityStore.reports.set(report_uuid, report);
    return Promise.resolve(buildResponse(200, report));
  }

  if (method === "GET" && url.pathname === "/activity/report") {
    const report = activityStore.reports.get(qs.report_uuid) || {
      report_uuid: qs.report_uuid,
      template_uuid: qs.template_uuid,
      status: "complete",
    };
    return Promise.resolve(buildResponse(200, report));
  }

  if (method === "GET" && url.pathname === "/activity/register") {
    return Promise.resolve(
      buildResponse(200, paginate(activityStore.registerTypes || [], qs))
    );
  }

  if (method === "GET" && url.pathname === "/activity/register/subtype") {
    return Promise.resolve(
      buildResponse(200, paginate(activityStore.registerSubtypes || [], qs))
    );
  }

  if (method === "GET" && url.pathname === "/activity/activity") {
    return Promise.resolve(buildResponse(200, paginate([], qs)));
  }

  return null;
}

module.exports = {
  resetActivityMockStore,
  activityMockRouter,
};
