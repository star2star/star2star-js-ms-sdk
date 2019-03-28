//mocha requires
import "@babel/polyfill";
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = Util.getLogger();
const uuidv4 = require("uuid/v4");
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

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Workflow", function() {
  let accessToken,
    identityData,
    wfTemplateUUID,
    wfInstanceUUID,
    wfInstanceUUIDv2False,
    wfInstanceUUIDv2True,
    version,
    groupUUID;

  const groupName = "UNIT-TEST-GROUP";

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
        // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost(creds.MS_HOST);
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(creds.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error){
      return Promise.reject(error);
    }
  });

  it("Create Workflow With No Template", mochaAsync(async () => {
    try{
      if (!creds.isValid) throw new Error("Invalid Credentials");
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
        error.statusCode === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With No Template"));
  
  it("Create Workflow With Empty Template", mochaAsync(async () => {
    try{
      if (!creds.isValid) throw new Error("Invalid Credentials");
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
        error.statusCode === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With Empty Template"));

  it("Create Workflow With Invalid Template", mochaAsync(async () => {
    try{
      if (!creds.isValid) throw new Error("Invalid Credentials");
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Workflow.createWorkflowTemplate(
        accessToken,
        {
          uuid: uuidv4(),
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
        error.statusCode === 400,
        JSON.stringify(error, null, "\t")
      );
    }
  },"Create Workflow With Invalid Template"));
  
  it("Create Workflow Template", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
            "uuid": uuidv4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": uuidv4()
          },
          {
            "name": "Run External Process",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": uuidv4()
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
            "uuid": uuidv4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": "$params"
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
            "uuid": uuidv4()
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
            "uuid": uuidv4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": uuidv4()
          },
          {
            "name": "Run External Process",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": uuidv4()
          },
          {
            "name": "Pause Workflow",
            "description": "",
            "type": "normal",
            "uuid": uuidv4()
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
            "uuid": uuidv4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": "$params"
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
            "uuid": uuidv4()
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
            "uuid": uuidv4()
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
            "uuid": uuidv4(),
            "description": ""
          },
          {
            "name": "End Workflow",
            "description": "Indicate the end of a Workflow (required).",
            "type": "finish",
            "uuid": uuidv4()
          },
          {
            "name": "Run External Process",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": uuidv4()
          },
          {
            "name": "Compare Values_2",
            "description": "Analyze data and branch the Workflow accordingly.",
            "type": "decision",
            "uuid": uuidv4(),
            "decision": {
              "rules": {
                ">=": [
                  {
                    "var": "1553722724336"
                  },
                  "10"
                ]
              },
              "data": {
                "1553722724336": "$add"
              },
              "true_transition_name": "T-Compare Values_2-0",
              "false_transition_name": "T-Compare Values_2-1"
            }
          },
          {
            "name": "Run External Process_2",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": uuidv4()
          },
          {
            "name": "Run External Process_3",
            "description": "Execute a process outside of the Workflow, and branches based on results.",
            "type": "normal",
            "uuid": uuidv4()
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
            "uuid": uuidv4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": "$params"
                }
              }
            },
            "description": "Transition for Run External Process",
            "name": "T-Run External Process-0",
            "next_error_state": "End Workflow",
            "next_state": "Compare Values_2",
            "next_timeout_state": "End Workflow",
            "start_state": "Run External Process",
            "timeout": "30000",
            "uuid": uuidv4()
          },
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Compare Values_2 true ",
            "name": "T-Compare Values_2-0",
            "next_error_state": "Run External Process_2",
            "next_state": "Run External Process_2",
            "next_timeout_state": "Run External Process_2",
            "start_state": "Compare Values_2",
            "uuid": uuidv4(),
            "timeout": 0
          },
          {
            "condition": {
              "type": "passthrough",
              "data": {
                "passthrough_condition": {}
              }
            },
            "description": "Transition for Compare Values_2 false ",
            "name": "T-Compare Values_2-1",
            "next_error_state": "Run External Process_3",
            "next_state": "Run External Process_3",
            "next_timeout_state": "Run External Process_3",
            "start_state": "Compare Values_2",
            "uuid": uuidv4(),
            "timeout": 0
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": {
                    "x": "0",
                    "y": "1"
                  },
                  "result_path": "$complete"
                }
              }
            },
            "description": "Transition for Run External Process_2",
            "name": "T-Run External Process_2-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "Run External Process_2",
            "timeout": "30000",
            "uuid": uuidv4()
          },
          {
            "condition": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "james-add-numbers",
                  "blocking": true,
                  "parameters": {
                    "x": "0",
                    "y": "0"
                  },
                  "result_path": "$complete"
                }
              }
            },
            "description": "Transition for Run External Process_3",
            "name": "T-Run External Process_3-0",
            "next_error_state": "End Workflow",
            "next_state": "End Workflow",
            "next_timeout_state": "End Workflow",
            "start_state": "Run External Process_3",
            "timeout": "30000",
            "uuid": uuidv4()
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
  

  it("List Workflow Templates", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
      if (!creds.isValid) throw new Error("Invalid Credentials");
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
        error.status === "failed",
        JSON.stringify(error, null, "\t")
      );
    }
  },"Get Workflow Template With Invalid Filters"));
  
  it("Start Workflow Version 2: False", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
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
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        version: "1.0.2",
        start_state: "Trigger Manually",
        group_uuid: groupUUID,
        input_vars: { params: { x: 5, y: 4 } }
      },
      trace
    );
    wfInstanceUUIDv2False = response.uuid;
    assert.ok(
      response.workflow_vars.params.x === 5,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Start Workflow Version 2: True"));
 
  it("Get Workflow Instance v2 History", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.getWfInstanceHistory(
      accessToken,
      wfInstanceUUIDv2False,
      trace
    );
    assert.ok(
      response.workflow_vars.complete.add === 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance v2 History"));
  
  //TODO Test start and end time filters....nh 8/30/18
  it("Get Workflow Template History", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await s2sMS.Workflow.getWfTemplateHistory(
      accessToken,
      wfTemplateUUID,
      0, //offset
      3, //limit
      { version: "1.0.1" },
      trace
    );
    assert.ok(
      true,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Template History"));
  
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
  it("List Workflow Groups ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.listWorkflowGroups(
      accessToken,
      0, //offset
      10, //limit
      {
        template_uuid: wfTemplateUUID //filters
      }
    )
      .then(response => {
        //console.log("List Workflow Group RESPONSE", response.items);
        assert(response.items[0].master.uuid === wfInstanceUUID);
        done();
      })
      .catch(error => {
        console.log("List Workflow Template History ERROR", error);
        done(new Error(error));
      });
  });

  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
  it("Get Workflow Group ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.getWorkflowGroup(accessToken, groupUUID)
      .then(response => {
        //console.log("Get Workflow Group RESPONSE", response);
        assert(response.uuid === groupUUID);
        done();
      })
      .catch(error => {
        console.log("Get Workflow Group ERROR", error);
        done(new Error(error));
      });
  });

  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
  it("Update Workflow Group ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.updateWorkflowGroup(
      accessToken,
      groupUUID,
      "cancelled", //status
      { important_things: true } //data
    )
      .then(response => {
        //console.log("Update Workflow Group RESPONSE", response);
        assert(
          response.status === "cancelled" &&
            response.data.important_things === true
        );
        done();
      })
      .catch(error => {
        console.log("Update Workflow Group ERROR", error);
        done(new Error(error));
      });
  });

  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
  it("Delete Workflow Template", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.deleteWorkflowTemplate(accessToken, wfTemplateUUID, version)
      .then(response => {
        //console.log("Delete Workflow Template RESPONSE", response);
        assert(response.status === "ok");
        s2sMS.Workflow.deleteWorkflowTemplate(
          accessToken,
          wfTemplateUUID,
          "1.0.2"
        )
          .then(response => {
            //console.log("Delete Workflow Template RESPONSE", response);
            assert(response.status === "ok");
            done();
          })
          .catch(error => {
            console.log("Delete Workflow Template version 1.0.2 ERROR", error);
            done(new Error(error));
          });
      })
      .catch(error => {
        console.log(`Delete Workflow Template ${version} ERROR`, error);
        done(new Error(error));
      });
  });
  
  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
