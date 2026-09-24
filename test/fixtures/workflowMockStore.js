"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");

const MOCK_MS_HOST = "https://mock-ms.test";
const WORKFLOW_BASE = `${MOCK_MS_HOST}/workflow`;

const TEMPLATE_UUID = "11111111-1111-1111-1111-111111111111";
const INSTANCE_UUID = "22222222-2222-2222-2222-222222222222";
const GROUP_UUID = "33333333-3333-3333-3333-333333333333";

const store = {
  template: null,
  instances: {},
  groups: {},
};

function resetWorkflowMockStore() {
  store.template = {
    uuid: TEMPLATE_UUID,
    name: "Unit-Test",
    description: "Unit-Test",
    version: "1.0.0",
    status: "active",
    states: [],
    transitions: [],
  };
  store.instances = {
    [INSTANCE_UUID]: {
      uuid: INSTANCE_UUID,
      template_uuid: TEMPLATE_UUID,
      status: "running",
      workflow_vars: { inputX: 1, constantA: "mock" },
      incoming_data: { seed: true },
    },
  };
  store.groups = {
    [GROUP_UUID]: {
      uuid: GROUP_UUID,
      name: "UNIT-TEST-GROUP",
      status: "active",
      data: { step: 1 },
    },
  };
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

function errorResponse(code, message) {
  return buildResponse(code, {
    code,
    message,
    trace_id: "mock-trace-id",
    details: [],
  });
}

function workflowMockRouter(method, url, init) {
  if (!url.href.startsWith(WORKFLOW_BASE)) {
    return errorResponse(404, `unmocked host ${url.href}`);
  }

  const workflowPrefix = "/workflow";
  if (!url.pathname.startsWith(workflowPrefix)) {
    return Promise.resolve(errorResponse(404, `not workflow path ${url.pathname}`));
  }
  const relative = url.pathname.slice(workflowPrefix.length) || "/";
  const segments = relative.split("/").filter(Boolean);

  // POST /workflows
  if (method === "POST" && segments.length === 1 && segments[0] === "workflows") {
    return readJsonBody(init).then((body) => {
      if (body === undefined || body === null) {
        return errorResponse(400, "template body required");
      }
      if (typeof body === "object" && Object.keys(body).length === 0) {
        return errorResponse(400, "template body required");
      }
      if (body.status && body.status !== "active") {
        return errorResponse(400, "invalid template status");
      }
      const created = {
        ...store.template,
        ...body,
        uuid: body.uuid || TEMPLATE_UUID,
        version: body.version || "1.0.0",
      };
      store.template = created;
      return buildResponse(200, created);
    });
  }

  // PUT /workflows/:uuid
  if (method === "PUT" && segments.length === 2 && segments[0] === "workflows") {
    return readJsonBody(init).then((body) => {
      store.template = { ...store.template, ...body, uuid: segments[1] };
      return buildResponse(200, store.template);
    });
  }

  // GET /workflows
  if (method === "GET" && segments.length === 1 && segments[0] === "workflows") {
    return Promise.resolve(
      buildResponse(200, {
        items: [store.template],
        metadata: { count: 1, total: 1, offset: 0, limit: 10 },
      })
    );
  }

  // GET /workflows/:uuid
  if (method === "GET" && segments.length === 2 && segments[0] === "workflows") {
    return Promise.resolve(buildResponse(200, { ...store.template, uuid: segments[1] }));
  }

  // POST /workflows/:uuid/instances
  if (
    method === "POST" &&
    segments.length === 3 &&
    segments[0] === "workflows" &&
    segments[2] === "instances"
  ) {
    return readJsonBody(init).then((body) => {
      const instanceId = v4();
      const instance = {
        uuid: instanceId,
        template_uuid: segments[1],
        status: "running",
        workflow_vars: body?.input_vars || {},
      };
      store.instances[instanceId] = instance;
      return buildResponse(200, instance);
    });
  }

  // GET /workflows/:uuid/instances
  if (
    method === "GET" &&
    segments.length === 3 &&
    segments[0] === "workflows" &&
    segments[2] === "instances"
  ) {
    const items = Object.values(store.instances).filter(
      (i) => i.template_uuid === segments[1]
    );
    return Promise.resolve(
      buildResponse(200, {
        items,
        metadata: { count: items.length, total: items.length, offset: 0, limit: 10 },
      })
    );
  }

  // GET /workflows/:uuid/:version (semver segment, not "instances")
  if (
    method === "GET" &&
    segments.length === 3 &&
    segments[0] === "workflows" &&
    segments[2] !== "instances"
  ) {
    return Promise.resolve(
      buildResponse(200, {
        ...store.template,
        uuid: segments[1],
        version: segments[2],
      })
    );
  }

  // GET /workflows/:uuid/instances/:instanceId
  if (
    method === "GET" &&
    segments.length === 4 &&
    segments[0] === "workflows" &&
    segments[2] === "instances"
  ) {
    const instance = store.instances[segments[3]];
    if (!instance) {
      return Promise.resolve(errorResponse(404, "instance not found"));
    }
    return Promise.resolve(buildResponse(200, instance));
  }

  // DELETE /workflows/:uuid/instances/:instanceId
  if (
    method === "DELETE" &&
    segments.length === 4 &&
    segments[0] === "workflows" &&
    segments[2] === "instances"
  ) {
    delete store.instances[segments[3]];
    return Promise.resolve(buildResponse(204, null));
  }

  // DELETE /workflows/:uuid/:version
  if (method === "DELETE" && segments.length === 3 && segments[0] === "workflows") {
    return Promise.resolve(buildResponse(204, null));
  }

  // GET /history?template_uuid=... (template execution history)
  if (method === "GET" && segments.length === 1 && segments[0] === "history") {
    const templateUuid = url.searchParams.get("template_uuid");
    if (templateUuid) {
      return Promise.resolve(
        buildResponse(200, {
          items: [
            {
              uuid: v4(),
              template_uuid: templateUuid,
              result_type: "complete",
            },
          ],
          metadata: { count: 1, total: 1, offset: 0, limit: 10 },
        })
      );
    }
  }

  // GET /history/:instance/filter...
  if (method === "GET" && segments[0] === "history" && segments.length >= 2) {
    const instanceId = segments[1];
    const instance = store.instances[instanceId];
    if (!instance) {
      return Promise.resolve(errorResponse(404, "history not found"));
    }
    if (segments[2] === "filter" && segments[3] === "workflow_vars") {
      return Promise.resolve(buildResponse(200, { workflow_vars: instance.workflow_vars }));
    }
    if (segments[2] === "filter" && segments[3] === "incoming_data") {
      return Promise.resolve(buildResponse(200, { incoming_data: instance.incoming_data }));
    }
    if (segments[2] === "filter" && segments[3] === "transition_results") {
      return Promise.resolve(buildResponse(200, { transition_results: [] }));
    }
    if (segments[2] === "filter") {
      return Promise.resolve(
        buildResponse(200, {
          uuid: instanceId,
          workflow_vars: instance.workflow_vars,
          incoming_data: instance.incoming_data,
          states: [],
        })
      );
    }
  }

  // GET /groups
  if (method === "GET" && segments.length === 1 && segments[0] === "groups") {
    const items = Object.values(store.groups);
    return Promise.resolve(
      buildResponse(200, {
        items,
        metadata: { count: items.length, total: items.length, offset: 0, limit: 10 },
      })
    );
  }

  // GET /groups/:uuid
  if (method === "GET" && segments.length === 2 && segments[0] === "groups") {
    const group = store.groups[segments[1]];
    if (!group) {
      return Promise.resolve(errorResponse(404, "group not found"));
    }
    return Promise.resolve(buildResponse(200, group));
  }

  // PUT /groups/:uuid
  if (method === "PUT" && segments.length === 2 && segments[0] === "groups") {
    return readJsonBody(init).then((body) => {
      store.groups[segments[1]] = {
        ...store.groups[segments[1]],
        ...body,
        uuid: segments[1],
      };
      return buildResponse(200, store.groups[segments[1]]);
    });
  }

  return Promise.resolve(errorResponse(404, `unmocked ${method} ${url.pathname}`));
}

module.exports = {
  MOCK_MS_HOST,
  TEMPLATE_UUID,
  INSTANCE_UUID,
  GROUP_UUID,
  resetWorkflowMockStore,
  workflowMockRouter,
};
