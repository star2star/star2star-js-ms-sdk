//mocha requires
//TODO: Add tests for various result types and native JSONata transitions once workflow microservice is updated to include. nh 11/22/19
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = require("../src/node-logger").getInstance();
const { v4 } = require("uuid");
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func(name);
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};



describe("Workflow", function() {
  let accessToken,
    wfTemplateUUID,
    wfInstanceUUID,
    wfInstanceUUIDv2True,
    wfInstanceResultConst,
    wfInstanceResultSource,
    wfInstanceResultWfVars,
    version,
    groupUUID;

  const groupName = "UNIT-TEST-GROUP";

  before(async () => {
    try {
      

      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.MS_HOST);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.CPAAS_OAUTH_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
    } catch (error){
      return Promise.reject(error);
    }
  });

  it("Create Workflow With No Template", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Workflow.createWorkflowTemplate(
        accessToken,
        undefined,
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With No Template"));
  
  it("Create Workflow With Empty Template", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Workflow.createWorkflowTemplate(
        accessToken,
        {},
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With Empty Template"));

  it("Create Workflow With Invalid Template", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Workflow.createWorkflowTemplate(
        accessToken,
        {
          uuid: v4(),
          name: "Unit-Test",
          description: "Unit-Test",
          status: "inavlid-status",
          states: [{ type: "normal" }, { type: "invalid-type" }],
          transitions: [{ type: "normal" }, { type: "invalid-type" }]
        },
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error) {
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With Invalid Template"));
  
  it("Create Workflow Template", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        "name": "Unit-Test",
        "description": "Unit-Test",
        "uuid": wfTemplateUUID,
        "version": "1.0.1",
        "status": "active",
        "states": [
          {
            "name": "Trigger Manually",
            "type": "start",
            "uuid": v4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": v4()
          },
          {
            "name": "Run External Process",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": v4()
          }
        ],
        "transitions": [
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Trigger Manually",
            "name": "T-Trigger Manually-0",
            "next_error_state": "Run External Process",
            "next_state": "Run External Process",
            "next_timeout_state": "Run External Process",
            "start_state": "Trigger Manually",
            "timeout": "0",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": "^params"
                }
              }
            },
            "description": "Transition for Run External Process",
            "name": "T-Run External Process-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "Run External Process",
            "timeout": "30000",
            "uuid": v4()
          }
        ]
      },
      trace
    );
    wfTemplateUUID = response.uuid;
    version = response.version;
    assert.ok(
      response.hasOwnProperty("uuid") &&
      response.hasOwnProperty("version"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create Workflow Template"));
  
  it("Modify Workflow Template", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.modifyWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      {
        "name": "Unit-Test",
        "description": "Unit-Test Modified",
        "uuid": wfTemplateUUID,
        "version": "1.0.1",
        "status": "active",
        "states": [
          {
            "name": "Trigger Manually",
            "type": "start",
            "uuid": v4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": v4()
          },
          {
            "name": "Run External Process",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": v4()
          },
          {
            "name": "Pause Workflow",
            "description": "",
            "type": "normal",
            "uuid": v4()
          }
        ],
        "transitions": [
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Trigger Manually",
            "name": "T-Trigger Manually-0",
            "next_error_state": "Pause Workflow",
            "next_state": "Pause Workflow",
            "next_timeout_state": "Pause Workflow",
            "start_state": "Trigger Manually",
            "timeout": "0",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": "^params"
                }
              }
            },
            "description": "Transition for Run External Process",
            "name": "T-Run External Process-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "Run External Process",
            "timeout": "30000",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "wait",
              "data": {
                "wait_condition": {
                  "wait_value": "90000"
                }
              }
            },
            "description": "Transition for Pause Workflow",
            "name": "T-Pause Workflow-0",
            "next_error_state": "End Workflow",
            "next_state": "Run External Process",
            "next_timeout_state": "End Workflow",
            "start_state": "Pause Workflow",
            "timeout": "30000",
            "uuid": v4()
          }
        ]
      },
      trace
    );
    assert.ok(
      response.description === "Unit-Test Modified" &&
      response.status === "active",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Modify Workflow Template"));

  it("Create New Version Of Template With Descision", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        "name": "Unit-Test",
        "description": "Unit Test Version 2",
        "uuid": wfTemplateUUID,
        "version": "1.0.2",
        "status": "active",
        "states": [
          {
            "name": "Trigger Manually",
            "type": "start",
            "uuid": v4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": v4()
          },
          {
            "name": "Sum Lambda",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": v4()
          },
          {
            "name": "Compare Values",
            "description": "Analyze data and branch the Workflow accordingly.",
            "type": "decision",
            "uuid": v4(),
            "decision": {
              "rules": {
                ">=": [
                  {
                    "var": "1553806198481"
                  },
                  "10"
                ]
              },
              "data": {
                "1553806198481": "$output.sum"
              },
              "true_transition_name": "T-Compare Values-0",
              "false_transition_name": "T-Compare Values-1"
            }
          },
          {
            "name": "True Lamda",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": v4()
          },
          {
            "name": "False Lambda",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": v4()
          }
        ],
        "transitions": [
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Trigger Manually",
            "name": "T-Trigger Manually-0",
            "next_error_state": "Sum Lambda",
            "next_state": "Sum Lambda",
            "next_timeout_state": "Sum Lambda",
            "start_state": "Trigger Manually",
            "timeout": "0",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "sumnumbers",
                  "blocking": true,
                  "parameters": "^params",
                  "result_path": "$output"
                }
              }
            },
            "description": "Transition for Sum Lambda",
            "name": "T-Sum Lambda-0",
            "next_error_state": "End Workflow",
            "next_state": "Compare Values",
            "next_timeout_state": "End Workflow",
            "start_state": "Sum Lambda",
            "timeout": "30000",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Compare Values true ",
            "name": "T-Compare Values-0",
            "next_error_state": "True Lamda",
            "next_state": "True Lamda",
            "next_timeout_state": "True Lamda",
            "start_state": "Compare Values",
            "uuid": v4(),
            "timeout": 0
          },
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Compare Values false ",
            "name": "T-Compare Values-1",
            "next_error_state": "False Lambda",
            "next_state": "False Lambda",
            "next_timeout_state": "False Lambda",
            "start_state": "Compare Values",
            "uuid": v4(),
            "timeout": 0
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "sumnumbers",
                  "blocking": true,
                  "parameters": {
                    "x": "0",
                    "y": "1"
                  },
                  "result_path": "$decision"
                }
              }
            },
            "description": "Transition for True Lamda",
            "name": "T-True Lamda-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "True Lamda",
            "timeout": "30000",
            "uuid": v4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "sumnumbers",
                  "blocking": true,
                  "parameters": {
                    "x": "0",
                    "y": "0"
                  },
                  "result_path": "$decision"
                }
              }
            },
            "description": "Transition for False Lambda",
            "name": "T-False Lambda-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "False Lambda",
            "timeout": "30000",
            "uuid": v4()
          }
        ]
      },
      trace
    );
    assert.ok(
      response.description === "Unit Test Version 2" &&
      response.status === "active",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create New Version Of Template With Descision"));
  
  it("Start Workflow Version 1", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        version: version,
        start_state: "Trigger Manually",
        group_name: groupName,
        input_vars: { params: { x: 1, y: 2 } }
      },
      trace
    );
    wfInstanceUUID = response.uuid;
    groupUUID = response.group_uuid;
    assert.ok(
      response.hasOwnProperty("uuid") &&
      response.current_state === "Trigger Manually",
      response.workflow_vars.params.x === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Start Workflow Version 1"));
  
  it("List Running Workflows", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const filters = [];
    filters["verion"] = version;
    const response = await s2sMS.Workflow.listRunningWorkflows(
      accessToken,
      wfTemplateUUID,
      0, //offset
      1, //limit
      filters,
      trace
    );
    assert.ok(
      response.items[0].template_version === version &&
      response.items[0].uuid === wfInstanceUUID,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Running Workflows"));
  
  it("Get Workflow Instance", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getRunningWorkflow(
      accessToken,
      wfTemplateUUID,
      wfInstanceUUID
    );
    assert.ok(
      response.object.template_version === version &&
      response.object.template_uuid === wfTemplateUUID,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance"));
  
  it("Cancel Workflow Instance", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.cancelWorkflow(
      accessToken,
      wfTemplateUUID,
      wfInstanceUUID, trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Cancel Workflow Instance"));
  
  it("Get Workflow Instance v1 History", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      wfInstanceUUID,
      trace
    );
    assert.ok(
      response.result_type === "cancelled",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance v1 History"));

  it("Get Filtered Workflow Instance History", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      wfInstanceUUID,
      false,
      false,
      false,
      trace
    );
    assert.ok(
      response.result_type === "cancelled",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Filtered Workflow Instance History"));
  
  it("Get Workflow Instance History Workflow Vars", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWfInstanceWorkflowVars(
      accessToken,
      wfInstanceUUID,
      trace
    );
    assert.ok(
      response.result_type === "cancelled",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance History Workflow Vars"));

  it("Get Workflow Instance History Incoming Data", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWfInstanceIncomingData(
      accessToken,
      wfInstanceUUID,
      trace
    );
    assert.ok(
      response.result_type === "cancelled",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance History Incoming Data"));

  it("Get Workflow Instance History Transition Results", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWfInstanceResults(
      accessToken,
      wfInstanceUUID,
      transitionUUID,
      trace
    );
    assert.ok(
      response.result_type === "cancelled",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance History Transition Results"));

  it("List Workflow Templates", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.listWorkflowTemplates(
      accessToken,
      0, //offset
      1, //limit
      {
        "show_versions": true,
        "status": "active"
      },
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items.length > 0 &&
      response.items[0].hasOwnProperty("uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Workflow Templates"));
  
  it("Get Workflow Template", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      {"expand": "versions"},
      trace
    );
    assert.ok(
      response.version === "1.0.2",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Template"));
  
  it("Get Workflow Template With Version", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      {"version": "1.0.1"},
      trace
    );
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Template With Version"));
  
  it("Get Workflow Template With Invalid Filters", mochaAsync(async () => {
    try{
      if (!process.env.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Workflow.getWorkflowTemplate(
        accessToken,
        wfTemplateUUID,
        {
          "version": "0.0.1",
          "expand": "versions"
        },
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.code === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Get Workflow Template With Invalid Filters"));
  
  it("Start Workflow Version 2: False", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        version: "1.0.2",
        start_state: "Trigger Manually",
        group_uuid: groupUUID,
        input_vars: { params: { x: 2, y: 3 } }
      },
      trace
    );
    assert.ok(
      response.workflow_vars.params.x === 2,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Start Workflow Version 2: False"));
    
  it("Start Workflow Version 2: True", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        version: "1.0.2",
        start_state: "Trigger Manually",
        group_uuid: groupUUID,
        input_vars: { params: { x: 5, y: 6 } }
      },
      trace
    );
    wfInstanceUUIDv2True = response.uuid;
    assert.ok(
      response.workflow_vars.params.x === 5,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Start Workflow Version 2: True"));
 
  it("Get Workflow Instance v2 History", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      wfInstanceUUIDv2True,
      trace
    );
    assert.ok(
      response.workflow_vars.decision.sum === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance v2 History"));
  
  //TODO Test start and end time filters....nh 8/30/18
  it("Get Workflow Template History", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.getWfTemplateHistory(
      accessToken,
      wfTemplateUUID,
      0, //offset
      100000, //limit
      {
        version: "1.0.1",
        aggregate: true
      },
      trace
    );
    assert.ok(
      true,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Template History"));
  
  it("List Workflow Groups", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.listWorkflowGroups(
      accessToken,
      0, //offset
      10, //limit
      {
        template_uuid: wfTemplateUUID //filters
      },
      trace
    );
    assert.ok(
      response.items[0].master.uuid === wfInstanceUUID,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Workflow Groups"));

  it("Get Workflow Group", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroup(
      accessToken,
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
      trace
    );
    assert.ok(
      response.hasOwnProperty("uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group"));
  
  it("Get Workflow Group Filtered", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroupFiltered(
      accessToken,
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
     {"show_master":true, "show_children":true, "show_data":true},
      trace
    );
    assert.ok(
      response.hasOwnProperty("uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group Filtered"));

  it("Get Workflow Group Master", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroupMaster(
      accessToken, 
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
      trace
    );
    assert.ok(
      response.hasOwnProperty("result"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group Master"));

  it("Get Workflow Group Data", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroupData(
      accessToken,
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
      trace
    );
    assert.ok(
      true, //data: { important_things: true }
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group Data"));

  it("Get Workflow Group Children", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroupChildren(
      accessToken,
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
      trace
    );
    assert.ok(
      response.length > 0 && response[0].hasOwnProperty("uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group Children"));

  it("Get Workflow Group Child", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getWorkflowGroupChild(
      accessToken,
      // groupUUID,
      "fd85e1ea-46f8-4d3d-93ff-6565996ed014",
      // childUUID,
      "c7219bc7-9174-4df5-bbe6-817ee47ce2c2",
      trace
    );
    assert.ok(
      response.hasOwnProperty("result"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Group Child"));

  it("Update Workflow Group", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.updateWorkflowGroup(
      accessToken,
      groupUUID,
      "cancelled", //status
      { important_things: true }, //data
      trace
    );
    assert.ok(
      response.status === "cancelled" &&
      response.data.important_things === true,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Update Workflow Group"));

  it("Test Result Constant", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    //create new version of WF
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        "name": "Unit Test",
        "description": "Unit Test",
        "uuid": wfTemplateUUID,
        "version": "1.0.3",
        "status": "active",
        "states": [
          {
            "name": "Trigger Manually",
            "type": "start",
            "uuid": "575544fa-7036-4de0-9e10-51de1a60d598",
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": "80fe075e-872a-405d-bd29-96631852d130"
          },
          {
            "name": "Find keywords",
            "description": "Will return true or false if the keywords are in a string ",
            "type": "normal",
            "uuid": "fec97b32-50a0-4f54-a0c1-d8589a578e25"
          }
        ],
        "transitions": [
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Trigger Manually",
            "name": "T-Trigger Manually-0",
            "next_error_state": "Find keywords",
            "next_state": "Find keywords",
            "next_timeout_state": "Find keywords",
            "start_state": "Trigger Manually",
            "timeout": "0",
            "uuid": "2c9dcfd3-de43-4c7c-8978-27cc38a4504a"
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "echo",
                  "blocking": true,
                  "parameters": "^input",
                  "result": [
                    {
                      "source": "constant",
                      "name": "constantA",
                      "path": "some string" 
                    },
                    {
                      "source": "constant",
                      "name": "constantB",
                      "path": ["a","b",{"c":true}] 
                    },
                    {
                      "source": "constant",
                      "name": "constantC",
                      "path": {"theObj":["a","b",{"c":true}]} 
                    },
                    {
                      "source": "constant",
                      "name": "constantD",
                      "path": true 
                    },
                    {
                      "source": "workflow_vars",
                      "name": "inputX",
                      "path": "input.inputX"
                    },
                    {
                      "source": "workflow_vars",
                      "name": "derivedObj",
                      "path": "constantC.theObj[2]"
                    },
                    {
                      "source": "result",
                      "name": "lambdaOutput1",
                      "path": "$" 
                    },
                    {
                      "source": "result",
                      "name": "lambdaOutput2",
                      "path": "inputW.c" 
                    },
                    {
                      "source": "result",
                      "name": "lambdaOutput3",
                      "path": "inputW.b[2]" 
                    },
                    {
                      "source": "result",
                      "name": "lambdaOutput4",
                      "path": "inputY[1]" 
                    }
                  ]
                }
              }
            },
            "description": "Transition for Find keywords",
            "name": "T-Find keywords-2",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": 30000,
            "start_state": "Find keywords",
            "timeout": 30000,
            "uuid": "b6dfdb97-9c2b-4ffc-ae81-1572a6dd6b82"
          }
        ]
      },
      trace
    );
    //start the WF
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        version: "1.0.3",
        start_state: "Trigger Manually",
        group_uuid: groupUUID,
        input_vars: { 
          "input": {
            "inputW": {
              "a": {"1": true},
              "b": [ "1", "2", "3"],
              "c": "some string",
              "d": undefined,
              "e": null,
              "f": true
            },
            "inputX": 1, 
            "inputY": ["0", "1", "2"],
            "inputZ": true
          }
        }
      },
      trace
    );
    //wait for completion
    await new Promise(resolve => setTimeout(resolve, 4000));

    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const wfResults = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      response.uuid,
      trace
    );
    assert.ok(
      wfResults.workflow_vars.constantA === "some string" &&
      wfResults.workflow_vars.constantB[2].c === true &&
      wfResults.workflow_vars.constantC.theObj[0] === "a" &&
      wfResults.workflow_vars.constantD === true &&
      wfResults.workflow_vars.inputX === 1 &&
      wfResults.workflow_vars.derivedObj.c === true &&
      wfResults.workflow_vars.lambdaOutput1.inputZ === true &&
      wfResults.workflow_vars.lambdaOutput2 === "some string" &&
      wfResults.workflow_vars.lambdaOutput3 === "3" &&
      wfResults.workflow_vars.lambdaOutput4 === "1",
      JSON.stringify(wfResults, null, "\t")
    );
    return wfResults;
  },"Test Result Constant"));
  
  it("Delete Workflow Template", mochaAsync(async () => {
    if (!process.env.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Workflow.deleteWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      "1.0.1",
      trace
    );

    await s2sMS.Workflow.deleteWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      "1.0.2",
      trace
    );

    const response = await s2sMS.Workflow.deleteWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      "1.0.3",
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Workflow Template"));
  
  // template
  // it("change me", mochaAsync(async () => {
  //   if (!process.env.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
