"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const formsStore = {
  forms: new Map(),
  templates: new Map(),
  submissions: new Map(),
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

function resetFormsMockStore() {
  formsStore.forms.clear();
  formsStore.templates.clear();
  formsStore.submissions.clear();
  const formUuid = v4();
  formsStore.forms.set(formUuid, { uuid: formUuid, name: "Mock Form" });
}

function formsMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/forms/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  if (method === "GET" && url.pathname === "/forms/forms") {
    const items = [...formsStore.forms.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "POST" && url.pathname === "/forms/forms") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const form = { ...(body || {}), uuid };
      formsStore.forms.set(uuid, form);
      return buildResponse(200, form);
    });
  }

  const formGet = url.pathname.match(/^\/forms\/forms\/([^/]+)$/);
  if (formGet && method === "GET") {
    const form = formsStore.forms.get(formGet[1]) || { uuid: formGet[1] };
    return Promise.resolve(buildResponse(200, form));
  }

  if (formGet && method === "DELETE") {
    formsStore.forms.delete(formGet[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  const submissions = url.pathname.match(/^\/forms\/forms\/([^/]+)\/submission$/);
  if (submissions && method === "GET") {
    const items = formsStore.submissions.get(submissions[1]) || [];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (submissions && method === "POST") {
    return readJsonBody(init).then((body) => {
      const entry = { uuid: v4(), ...(body || {}) };
      const list = formsStore.submissions.get(submissions[1]) || [];
      list.push(entry);
      formsStore.submissions.set(submissions[1], list);
      return buildResponse(200, entry);
    });
  }

  if (method === "GET" && url.pathname === "/forms/template") {
    const items = [...formsStore.templates.values()];
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "POST" && url.pathname === "/forms/template") {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const template = { ...(body || {}), uuid, template_uuid: uuid };
      formsStore.templates.set(uuid, template);
      return buildResponse(200, template);
    });
  }

  const templateGet = url.pathname.match(/^\/forms\/template\/([^/]+)$/);
  if (templateGet && method === "GET") {
    const template = formsStore.templates.get(templateGet[1]) || {
      uuid: templateGet[1],
      template_uuid: templateGet[1],
      definition: {},
    };
    return Promise.resolve(buildResponse(200, template));
  }

  if (templateGet && method === "PUT") {
    return readJsonBody(init).then((body) => {
      const updated = {
        ...(formsStore.templates.get(templateGet[1]) || { uuid: templateGet[1] }),
        ...(body || {}),
      };
      formsStore.templates.set(templateGet[1], updated);
      return buildResponse(200, updated);
    });
  }

  if (templateGet && method === "DELETE") {
    formsStore.templates.delete(templateGet[1]);
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

module.exports = {
  resetFormsMockStore,
  formsMockRouter,
};
