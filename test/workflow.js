"use strict";

const assert = require("assert");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const { MOCK_ACCESS_TOKEN } = require("./fixtures/mockConstants");
const { resetWorkflowMockStore } = require("./fixtures/workflowMockStore");
const {
  TEMPLATE_UUID,
  INSTANCE_UUID,
  GROUP_UUID,
} = require("./fixtures/workflowMockStore");

describe("Workflow (mocked HTTP)", function () {
  const accessToken = MOCK_ACCESS_TOKEN;
  let trace = Util.generateNewMetaData();

  before(function () {
    resetWorkflowMockStore();
  });

  it("rejects createWorkflowTemplate with empty body", async function () {
    try {
      await s2sMS.Workflow.createWorkflowTemplate(accessToken, null, trace);
      assert.fail("expected error");
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });

  it("creates and modifies a workflow template", async function () {
    trace = Util.generateNewMetaData(trace);
    const created = await s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        name: "Unit-Test",
        description: "Unit-Test",
        uuid: TEMPLATE_UUID,
        version: "1.0.0",
        status: "active",
        states: [{ name: "Start", type: "start", uuid: TEMPLATE_UUID }],
        transitions: [],
      },
      trace
    );
    assert.equal(created.uuid, TEMPLATE_UUID);

    const modified = await s2sMS.Workflow.modifyWorkflowTemplate(
      accessToken,
      TEMPLATE_UUID,
      { ...created, description: "Unit-Test Modified" },
      trace
    );
    assert.equal(modified.description, "Unit-Test Modified");
  });

  it("lists and fetches workflow templates", async function () {
    trace = Util.generateNewMetaData(trace);
    const list = await s2sMS.Workflow.listWorkflowTemplates(
      accessToken,
      0,
      10,
      undefined,
      trace
    );
    assert.ok(Array.isArray(list.items) && list.items.length === 1);

    const one = await s2sMS.Workflow.getWorkflowTemplate(
      accessToken,
      TEMPLATE_UUID,
      undefined,
      trace
    );
    assert.equal(one.uuid, TEMPLATE_UUID);

    const versioned = await s2sMS.Workflow.getWorkflowTemplate(
      accessToken,
      TEMPLATE_UUID,
      { version: "1.0.0" },
      trace
    );
    assert.equal(versioned.version, "1.0.0");
  });

  it("rejects getWorkflowTemplate with version and expand together", async function () {
    try {
      await s2sMS.Workflow.getWorkflowTemplate(accessToken, TEMPLATE_UUID, {
        version: "1.0.0",
        expand: "states",
      });
      assert.fail("expected error");
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });

  it("starts and lists workflow instances", async function () {
    trace = Util.generateNewMetaData(trace);
    const started = await s2sMS.Workflow.startWorkflow(
      accessToken,
      TEMPLATE_UUID,
      { input_vars: { inputX: 42 } },
      trace
    );
    assert.ok(started.uuid);

    const listed = await s2sMS.Workflow.listRunningWorkflows(
      accessToken,
      TEMPLATE_UUID,
      0,
      10,
      undefined,
      trace
    );
    assert.ok(listed.items.length >= 1);

    const running = await s2sMS.Workflow.getRunningWorkflow(
      accessToken,
      TEMPLATE_UUID,
      started.uuid,
      trace
    );
    assert.equal(running.uuid, started.uuid);
  });

  it("reads workflow instance history slices", async function () {
    trace = Util.generateNewMetaData(trace);
    const history = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      INSTANCE_UUID,
      undefined,
      trace
    );
    assert.equal(history.uuid, INSTANCE_UUID);

    const wfVars = await s2sMS.Workflow.getWfInstanceWorkflowVars(
      accessToken,
      INSTANCE_UUID,
      trace
    );
    assert.ok(wfVars.workflow_vars);

    const incoming = await s2sMS.Workflow.getWfInstanceIncomingData(
      accessToken,
      INSTANCE_UUID,
      trace
    );
    assert.ok(incoming.incoming_data);
  });

  it("cancels a running workflow instance", async function () {
    trace = Util.generateNewMetaData(trace);
    const cancelled = await s2sMS.Workflow.cancelWorkflow(
      accessToken,
      TEMPLATE_UUID,
      INSTANCE_UUID,
      trace
    );
    assert.equal(cancelled.status, "ok");
  });

  it("starts a workflow via startWorkflowFlat", async function () {
    trace = Util.generateNewMetaData(trace);
    const started = await s2sMS.Workflow.startWorkflowFlat(
      accessToken,
      TEMPLATE_UUID,
      { foo: "bar" },
      true,
      false,
      "1.0.0",
      undefined,
      GROUP_UUID,
      "UNIT-TEST-GROUP",
      trace
    );
    assert.ok(started.uuid);
  });

  it("lists and updates workflow groups", async function () {
    trace = Util.generateNewMetaData(trace);
    const groups = await s2sMS.Workflow.listWorkflowGroups(
      accessToken,
      0,
      10,
      undefined,
      trace
    );
    assert.ok(groups.items.length >= 1);

    const group = await s2sMS.Workflow.getWorkflowGroup(
      accessToken,
      GROUP_UUID,
      trace
    );
    assert.equal(group.uuid, GROUP_UUID);

    const updated = await s2sMS.Workflow.updateWorkflowGroup(
      accessToken,
      GROUP_UUID,
      "complete",
      { step: 2 },
      trace
    );
    assert.equal(updated.status, "complete");
  });

  it("deletes a workflow template version", async function () {
    trace = Util.generateNewMetaData(trace);
    const deleted = await s2sMS.Workflow.deleteWorkflowTemplate(
      accessToken,
      TEMPLATE_UUID,
      "1.0.0",
      trace
    );
    assert.equal(deleted.status, "ok");
  });
});
