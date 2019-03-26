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
        name: "UNIT-TEST",
        description: "Unit Test Modified",
        uuid: wfTemplateUUID,
        version: version,
        status: "inactive",
        globals: {"token": accessToken},
        states: [
          {
            uuid: uuidv4(),
            name: "START_STATE",
            description: "start",
            type: "start"
          },
          {
            uuid: uuidv4(),
            name: "END_STATE_ONE",
            description: "end state",
            type: "finish"
          },
          {
            uuid: uuidv4(),
            name: "NORMAL_STATE_TEST",
            description: "normal",
            type: "normal"
          }
        ],
        transitions: [
          {
            uuid: uuidv4(),
            name: "T1",
            description: "transition one",
            start_state: "START_STATE",
            next_state: "NORMAL_STATE_TEST",
            next_error_state: "NORMAL_STATE_TEST",
            next_timeout_state: "NORMAL_STATE_TEST",
            timeout: "0",
            condition: {
              "type": "passthrough"
            }
          },
          {
            uuid: uuidv4(),
            name: "T2",
            description: "transition with lambda",
            start_state: "NORMAL_STATE_TEST",
            next_state: "END_STATE_ONE",
            next_error_state: "END_STATE_ONE",
            next_timeout_state: "END_STATE_ONE",
            timeout: "0",
            condition: {
              type: "lambda",
              data: {
                lambda_condition: {
                  function_name: "dtg_test_lambda",
                  parameters: "$params",
                  blocking: true,
                  result_path: "$result"
                }
              }
            }
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
  it("Modify Workflow Template", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.modifyWorkflowTemplate(accessToken, wfTemplateUUID, {
      name: "UNIT-TEST",
      description: "Unit Test Modified",
      uuid: wfTemplateUUID,
      version: version,
      status: "active",
      globals: {"token": accessToken},
      states: [
        {
          uuid: uuidv4(),
          name: "START_STATE",
          description: "start",
          type: "start",
          position: {
            x: 123,
            y: -340
          }
        },
        {
          uuid: uuidv4(),
          name: "END_STATE_ONE",
          description: "end state",
          type: "finish"
        },
        {
          uuid: uuidv4(),
          name: "NORMAL_STATE_TEST",
          description: "normal",
          type: "normal"
        }
      ],
      transitions: [
        {
          uuid: uuidv4(),
          name: "T1",
          description: "transition one",
          start_state: "START_STATE",
          next_state: "NORMAL_STATE_TEST",
          next_error_state: "NORMAL_STATE_TEST",
          next_timeout_state: "NORMAL_STATE_TEST",
          timeout: "0",
          condition: {
            "type": "passthrough"
          }
        },
        {
          uuid: uuidv4(),
          name: "T2",
          description: "transition with lambda",
          start_state: "NORMAL_STATE_TEST",
          next_state: "END_STATE_ONE",
          next_error_state: "END_STATE_ONE",
          next_timeout_state: "END_STATE_ONE",
          timeout: "0",
          condition: {
            type: "lambda",
            data: {
              lambda_condition: {
                function_name: "dtg_test_lambda",
                parameters: "$params",
                blocking: true,
                result_path: "$result"
              },
              wait_condition: {
                wait_value: 5000
              }
            }
          }
        }
      ]
    })
      .then(response => {
        logger.info(
          `Modify Workflow Template RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.description === "Unit Test Modified" &&
            response.status === "active"
        );
        done();
      })
      .catch(error => {
        logger.error(
          `Modify Workflow Template ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("Create New Version Of Template With Descision", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(accessToken, {
      name: "UNIT-TEST",
      description: "Unit Test Version 2",
      uuid: wfTemplateUUID,
      version: "0.0.2",
      status: "active",
      globals: {"token": accessToken},
      states: [
        {
          uuid: uuidv4(),
          name: "START_STATE",
          description: "start",
          type: "start",
          position: {
            x: 123,
            y: -340
          }
        },
        {
          uuid: uuidv4(),
          name: "END_STATE_ONE",
          description: "end state",
          type: "finish"
        },
        {
          uuid: uuidv4(),
          name: "NORMAL_STATE_TEST",
          description: "normal",
          type: "normal"
        },
        {
          uuid: uuidv4(),
          name: "CHOICE_STATE",
          description: "A simple decision state",
          type: "decision",
          decision: {
            rules: {
              "<=": [{ var: "equality" }, 10]
            },
            data: {
              equality: "$params.a"
            },
            true_transition_name: "T3",
            false_transition_name: "T4"
          }
        }
      ],
      transitions: [
        {
          uuid: uuidv4(),
          name: "T1",
          description: "transition one",
          start_state: "START_STATE",
          next_state: "NORMAL_STATE_TEST",
          next_error_state: "NORMAL_STATE_TEST",
          next_timeout_state: "NORMAL_STATE_TEST",
          timeout: "0",
          condition: {
            "type": "passthrough"
          }
        },
        {
          uuid: uuidv4(),
          name: "T2",
          description: "transition with lambda",
          start_state: "NORMAL_STATE_TEST",
          next_state: "CHOICE_STATE",
          next_error_state: "END_STATE_ONE",
          next_timeout_state: "END_STATE_ONE",
          timeout: "0",
          condition: {
            type: "lambda",
            data: {
              lambda_condition: {
                function_name: "dtg_test_lambda",
                parameters: "$params",
                blocking: true,
                result_path: "$result"
              }
            }
          }
        },
        {
          uuid: uuidv4(),
          name: "T3",
          description: "true transition",
          start_state: "CHOICE_STATE",
          next_state: "END_STATE_ONE",
          next_error_state: "END_STATE_ONE",
          next_timeout_state: "END_STATE_ONE",
          timeout: "0",
          condition: {
            type: "lambda",
            data: {
              lambda_condition: {
                function_name: "dtg_test_lambda",
                parameters: { condition: true },
                blocking: true,
                result_path: "$decision"
              }
            }
          }
        },
        {
          uuid: uuidv4(),
          name: "T4",
          description: "false transition",
          start_state: "CHOICE_STATE",
          next_state: "END_STATE_ONE",
          next_error_state: "END_STATE_ONE",
          next_timeout_state: "END_STATE_ONE",
          timeout: "0",
          condition: {
            type: "lambda",
            data: {
              lambda_condition: {
                function_name: "dtg_test_lambda",
                parameters: { condition: false },
                blocking: true,
                result_path: "$decision"
              }
            }
          }
        }
      ]
    })
      .then(response => {
        logger.info(
          `Create New Version Of Template RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.description === "Unit Test Version 2" &&
            response.status === "active"
        );
        done();
      })
      .catch(error => {
        logger.error(
          `Create New Version Of Template ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("Start Workflow Version 1", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.startWorkflow(accessToken, wfTemplateUUID, {
      version: "0.0.1",
      start_state: "START_STATE",
      group_name: groupName,
      input_vars: { params: { a: 4, b: false } }
    })
      .then(response => {
        logger.info(
          `Start Workflow Version 1 RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.hasOwnProperty("uuid") &&
            response.current_state === "START_STATE" &&
            response.workflow_vars.params.a === 4
        );
        wfInstanceUUID = response.uuid;
        groupUUID = response.group_uuid;
        done();
      })
      .catch(error => {
        logger.error(
          `Start Workflow Version 1 ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("List Running Workflows", function(done) {
    if (!creds.isValid) return done();
    const filters = [];
    filters["verion"] = version;
    s2sMS.Workflow.listRunningWorkflows(
      accessToken,
      wfTemplateUUID,
      0,
      1,
      filters
    )
      .then(response => {
        logger.info(
          `List Running Workflows RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(response.items[0].template_version === version);
        done();
      })
      .catch(error => {
        logger.error(
          `List Running Workflows ERROR: ${JSON.stringify(error, null, "\t")}`
        );
        done(new Error(error));
      });
  });

  it("Get Workflow Instance", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Workflow.getRunningWorkflow(
      accessToken,
      wfTemplateUUID,
      wfInstanceUUID
    );
    assert.ok(
      1 === 1,
      // response.object.template_version === version &&
      //       response.object.template_uuid === wfTemplateUUID
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Workflow Instance"));
  
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
  it("Cancel Workflow Instance", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.cancelWorkflow(accessToken, wfTemplateUUID, wfInstanceUUID)
      .then(response => {
        //console.log("Cancel Workflow Instance RESPONSE", response);
        logger.info(
          `Cancel Workflow Instance RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(
          `Cancel Workflow Instance ERROR: ${JSON.stringify(error, null, "\t")}`
        );
        done(new Error(error));
      });
  });

  //Need more data/iterations for a solid test suite.... nh 8/30/18
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
  it("Get Workflow Instance v1 History", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.getWfInstanceHistory(accessToken, wfInstanceUUID)
      .then(response => {
        logger.info(
          `Get Workflow Instance v1 History RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(response.result_type === "cancelled");
        done();
      })
      .catch(error => {
        logger.error(
          `Get Workflow Instance v1 History ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("List Workflow Templates", function(done) {
    if (!creds.isValid) return done();
    const filters = [];
    filters["show_versions"] = true;
    filters["status"] = "inactive";
    s2sMS.Workflow.listWorkflowTemplates(accessToken, 0, 1, filters)
      .then(response => {
        logger.info(
          `List Workflow Templates RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.items.length === 1 &&
            response.items[0].hasOwnProperty("uuid") &&
            response.items[0].hasOwnProperty("version") &&
            response.items[0].hasOwnProperty("states") &&
            response.items[0].hasOwnProperty("transitions")
        );
        done();
      })
      .catch(error => {
        logger.error(
          `List Workflow Templates ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("Get Workflow Template", function(done) {
    const filters = [];
    filters["expand"] = "versions";
    if (!creds.isValid) return done();
    s2sMS.Workflow.getWorkflowTemplate(accessToken, wfTemplateUUID, filters)
      .then(response => {
        logger.info(
          `Get Workflow Template RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.description === "Unit Test Version 2" &&
            response.version === "0.0.2"
        );
        done();
      })
      .catch(error => {
        logger.error(
          `Get Workflow Template ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("Get Workflow Template With Version", function(done) {
    const filters = [];
    filters["version"] = "0.0.1";
    if (!creds.isValid) return done();
    s2sMS.Workflow.getWorkflowTemplate(accessToken, wfTemplateUUID, filters)
      .then(response => {
        logger.info(
          `Get Workflow Template With Version RESPONSE: ${JSON.stringify(response, null, "\t")}`
        );
        assert(
          response.description === "Unit Test Modified" &&
            response.version === "0.0.1"
        );
        done();
      })
      .catch(error => {
        logger.error(
          `Get Workflow Template With Version ERROR: ${JSON.stringify(error, null, "\t")}`
        );
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
  it("Get Workflow Template With Invalid Filters", function(done) {
    const filters = [];
    filters["version"] = "0.0.1";
    filters["expand"] = "versions";
    if (!creds.isValid) return done();
    s2sMS.Workflow.getWorkflowTemplate(accessToken, wfTemplateUUID, filters)
      .then(response => {
        logger.error(
          `Get Workflow Template With Invalid Filters ERROR: ${JSON.stringify(response, null, "\t")}`
        );
        assert(1 === 0);
        done(new Error(response));
      })
      .catch(error => {
        //asserts hang in catch blocks if they are false.
        if (error.status !== "failed") {
          logger.error(
            `Get Workflow Template With Invalid Filters ERROR: ${JSON.stringify(error, null, "\t")}`
          );
          done(new Error(error));
        } else {
          logger.info(
            `Get Workflow Template With Invalid Filters RESPONSE: ${JSON.stringify(error, null, "\t")}`
          );
          done();
        }
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
  it("Start Workflow Version 2: False", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.startWorkflow(accessToken, wfTemplateUUID, {
      version: "0.0.2",
      start_state: "START_STATE",
      group_uuid: groupUUID,
      input_vars: { params: { a: 11, b: false } }
    })
      .then(response => {
        //console.log("Start Workflow Version 2: False RESPONSE", response);
        assert(
          response.hasOwnProperty("uuid") &&
            response.current_state === "START_STATE" &&
            response.workflow_vars.params.a === 11
        );
        wfInstanceUUIDv2False = response.uuid;
        done();
      })
      .catch(error => {
        //console.log("Start Workflow Version 2: False ERROR", error);
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
  it("Start Workflow Version 2: True", function(done) {
    if (!creds.isValid) return done();
    setTimeout(() => {
      s2sMS.Workflow.startWorkflow(accessToken, wfTemplateUUID, {
        version: "0.0.2",
        start_state: "START_STATE",
        group_uuid: groupUUID,
        input_vars: { params: { a: 5, b: true } }
      })
        .then(response => {
          //console.log("Start Workflow Version 2: True RESPONSE", response);
          assert(
            response.hasOwnProperty("uuid") &&
              response.current_state === "START_STATE" &&
              response.workflow_vars.params.a === 5
          );
          wfInstanceUUIDv2True = response.uuid;
          done();
        })
        .catch(error => {
          console.log("Start Workflow Version 2: True ERROR", error);
          done(new Error(error));
        });
    }, 2000);
  });

  //FIXME why does this work randomly? nh
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
  it("Get Workflow Instance v2 History", function(done) {
    if (!creds.isValid) return done();
    //console.log("Standby 2 seconds for Workflow to Finish.....");
    setTimeout(() => {
      s2sMS.Workflow.getWfInstanceHistory(accessToken, wfInstanceUUIDv2False)
        .then(response => {
          //console.log("Get Workflow Instance v2 False History RESPONSE", response.workflow_vars.decision.message);
          assert(
            response.result_type === "complete" &&
              response.workflow_vars.decision.message ===
                "params: { condition: false }"
          );
          s2sMS.Workflow.getWfInstanceHistory(accessToken, wfInstanceUUIDv2True)
            .then(response => {
              //console.log("Get Workflow Instance v2 True History RESPONSE", response.workflow_vars.decision.message);
              assert(response.result_type === "complete");
              assert(
                response.workflow_vars.decision.message ===
                  "params: { condition: true }"
              );
              done();
            })
            .catch(error => {
              console.log("Get Workflow Instance History v2 True ERROR", error);
              done(new Error(error));
            });
        })
        .catch(error => {
          console.log("Get Workflow Instance History v2 False ERROR", error);
          done(new Error(error));
        });
    }, 2000); //Just enought time for them all to finish
  });

  //TODO Test start and end time filters....nh 8/30/18
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
  it("Get Workflow Template History", function(done) {
    if (!creds.isValid) return done();
    const filters = { version: "0.0.1" };
    s2sMS.Workflow.getWfTemplateHistory(
      accessToken,
      wfTemplateUUID,
      0,
      3,
      filters
    )
      .then(response => {
        //console.log("Get Workflow Template History RESPONSE", response);
        assert(response.items[0].result_type === "cancelled");
        done();
      })
      .catch(error => {
        console.log("Get Workflow Template History ERROR", error);
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
          "0.0.2"
        )
          .then(response => {
            //console.log("Delete Workflow Template RESPONSE", response);
            assert(response.status === "ok");
            done();
          })
          .catch(error => {
            console.log("Delete Workflow Template version 0.0.2 ERROR", error);
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
