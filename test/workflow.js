var assert = require("assert");
var s2sMS = require("../src");
var fs = require("fs");
const uuidv4 = require("uuid/v4");
let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Workflow", function () {
  let accessToken, identityData, wfTemplateUUID, wfInstanceUUID, version;
  

  before(function () {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

     // For tests, use the dev msHost
     s2sMS.setMsHost("https://cpaas.star2starglobal.net");
     s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
     s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
     // get accessToken to use in test cases
     // Return promise so that test cases will not fire until it resolves.
     return new Promise((resolve, reject)=>{
       s2sMS.Oauth.getAccessToken(
         creds.CPAAS_OAUTH_TOKEN,
         creds.email,
         creds.password
       )
       .then(oauthData => {
         //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
         accessToken = oauthData.access_token;
         s2sMS.Identity.getMyIdentityData(accessToken).then((idData)=>{
           s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid).then((identityDetails)=>{
             identityData = identityDetails;
             resolve();
           }).catch((e1)=>{
             reject(e1);
           });
         }).catch((e)=>{
           reject(e);
         });
       });
     });
  });

  it("Create Workflow With No Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken
    ).then(response => {
      console.log("Create Workflow With No Template RESPONSE", response);
      done(new Error(response));
    })
    .catch(error =>{
      //Asserts don't work correctly and time out if false in catch()
      if (error.statusCode !== 400) {
        console.log("Create Workflow With No Template ERROR");
        done(new Error(error));
      } else {
        done();
      }
    });
  });

  it("Create Workflow With Empty Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {}
    ).then(response => {
      console.log("Create Workflow With Empty Template RESPONSE", response);
      done(new Error(response));
    })
    .catch(error =>{
      if (error.statusCode !== 400) {
        console.log("Create Workflow With No Template ERROR");
        done(new Error(error));
      } else {
        done();
      }
    });
  });

  it("Create Workflow With Invalid Template", function (done) {
    if (!creds.isValid) return done();
    const body = {
      "uuid": uuidv4(),
      "name": "Unit-Test",
      "description": "Unit-Test",
      "status": "inavlid-status",
      "states": [
        {"type": "normal"},
        {"type": "invalid-type"}
      ],
      "transitions": [
        {"type": "normal"},
        {"type": "invalid-type"}
      ] 
    };
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      body
    ).then(response => {
      console.log("Create Workflow With Invalid Template RESPONSE", response);
      done(new Error(response));
    })
    .catch(error =>{
      if (error.statusCode !== 400 && error.body.key !== "workflow.invalid_status") {
        console.log("Create Workflow With No Template ERROR");
        done(new Error(error));
      } else {
        done();
      }
    });
  });

  it("Create Workflow Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        "name": "UNIT-TEST",
        "description": "Unit Test",
        "status": "inactive",
        "states": [
          {
            "uuid": uuidv4(),
            "name": "START_STATE",
            "description": "start",
            "type": "start"
          },
          {
            "uuid": uuidv4(),
            "name": "END_STATE_ONE",
            "description": "end state",
            "type": "finish"
          },
          {
            "uuid": uuidv4(),
            "name": "NORMAL_STATE_TEST",
            "description": "normal",
            "type": "normal"
          }
        ],
        "transitions": [
          {
            "uuid": uuidv4(),
            "name": "T1",
            "description": "transition one",
            "start_state": "START_STATE",
            "next_state": "NORMAL_STATE_TEST",
            "additional": false,
            "next_error_state": "NORMAL_STATE_TEST",
            "next_timeout_state": "NORMAL_STATE_TEST",
            "type": "normal",
            "timeout": "0",
            "conditions": []
          },
          {
            "uuid": uuidv4(),
            "name": "T2",
            "description": "transition with lambda",
            "start_state": "NORMAL_STATE_TEST",
            "next_state": "END_STATE_ONE",
            "additional": false,
            "next_error_state": "END_STATE_ONE",
            "next_timeout_state": "END_STATE_ONE",
            "type": "normal",
            "timeout": "0",
            "conditions": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "dtg_test_lambda",
                  "blocking": true
                },
                "wait_condition": {
                  "wait_value": 5
                }
              }
            }
          }
        ]
      }
    ).then(response => {
      //console.log("Create Workflow Template RESPONSE", response);
      assert(response.hasOwnProperty("uuid") && response.hasOwnProperty("version"));
      wfTemplateUUID = response.uuid;
      version = response.version;
      done();
    })
    .catch(error =>{
      console.log("Create Workflow Template ERROR", error);      
      done(new Error(error));
    });
  });

  it("Modify Workflow Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.modifyWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      {
        "name": "UNIT-TEST",
        "description": "Unit Test Modified",
        "uuid": wfTemplateUUID,
        "version": version,
        "status": "active",
        "states": [
          {
            "uuid": uuidv4(),
            "name": "START_STATE",
            "description": "start",
            "type": "start"
          },
          {
            "uuid": uuidv4(),
            "name": "END_STATE_ONE",
            "description": "end state",
            "type": "finish"
          },
          {
            "uuid": uuidv4(),
            "name": "NORMAL_STATE_TEST",
            "description": "normal",
            "type": "normal"
          }
        ],
        "transitions": [
          {
            "uuid": uuidv4(),
            "name": "T1",
            "description": "transition one",
            "start_state": "START_STATE",
            "next_state": "NORMAL_STATE_TEST",
            "additional": false,
            "next_error_state": "NORMAL_STATE_TEST",
            "next_timeout_state": "NORMAL_STATE_TEST",
            "type": "normal",
            "timeout": "0",
            "conditions": []
          },
          {
            "uuid": uuidv4(),
            "name": "T2",
            "description": "transition with lambda",
            "start_state": "NORMAL_STATE_TEST",
            "next_state": "END_STATE_ONE",
            "additional": false,
            "next_error_state": "END_STATE_ONE",
            "next_timeout_state": "END_STATE_ONE",
            "type": "normal",
            "timeout": "0",
            "conditions": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "dtg_test_lambda",
                  "blocking": true
                },
                "wait_condition": {
                  "wait_value": 5
                }
              }
            }
          }
        ]
      }
    ).then(response => {
      //console.log("Modify Workflow Template RESPONSE", response);
      assert(response.description === "Unit Test Modified" && response.status === "active");
      done();
    })
    .catch(error =>{
      console.log("Modify Workflow Template ERROR", error);      
      done(new Error(error));
    });
  });

  it("Create New Version Of Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
        "name": "UNIT-TEST",
        "description": "Unit Test Version 2",
        "uuid": wfTemplateUUID,
        "version": "0.0.2",
        "status": "inactive",
        "states": [
          {
            "uuid": uuidv4(),
            "name": "START_STATE",
            "description": "start",
            "type": "start"
          },
          {
            "uuid": uuidv4(),
            "name": "END_STATE_ONE",
            "description": "end state",
            "type": "finish"
          },
          {
            "uuid": uuidv4(),
            "name": "NORMAL_STATE_TEST",
            "description": "normal",
            "type": "normal"
          }
        ],
        "transitions": [
          {
            "uuid": uuidv4(),
            "name": "T1",
            "description": "transition one",
            "start_state": "START_STATE",
            "next_state": "NORMAL_STATE_TEST",
            "additional": false,
            "next_error_state": "NORMAL_STATE_TEST",
            "next_timeout_state": "NORMAL_STATE_TEST",
            "type": "normal",
            "timeout": "0",
            "conditions": []
          },
          {
            "uuid": uuidv4(),
            "name": "T2",
            "description": "transition with lambda",
            "start_state": "NORMAL_STATE_TEST",
            "next_state": "END_STATE_ONE",
            "additional": false,
            "next_error_state": "END_STATE_ONE",
            "next_timeout_state": "END_STATE_ONE",
            "type": "normal",
            "timeout": "0",
            "conditions": {
              "type": "lambda",
              "data": {
                "lambda_condition": {
                  "function_name": "dtg_test_lambda",
                  "blocking": true
                },
                "wait_condition": {
                  "wait_value": 5
                }
              }
            }
          }
        ]
      }
    ).then(response => {
      //console.log("Create New Version Of Template RESPONSE", response);
      assert(response.description === "Unit Test Version 2" && response.status === "inactive");
      done();
    })
    .catch(error =>{
      console.log("Create New Version Of Template ERROR", error);      
      done(new Error(error));
    });
  });
  
  it("Start Workflow", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.startWorkflow(
      accessToken,
      wfTemplateUUID,
      {
        "version": "0.0.1",
        "start_state": "START_STATE",
        "input_vars": {"a":4, "b": true }
      }
    ).then(response => {
      //console.log("Start Workflow RESPONSE", response);
      assert(response.hasOwnProperty("uuid") && response.current_state === "START_STATE");
      wfInstanceUUID = response.uuid;
      done();
    })
    .catch(error =>{
      console.log("Start Workflow ERROR", error);      
      done(new Error(error));
    });  
  });

  // it("List Running Workflows", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Workflow.listRunningWorkflows(
  //     accessToken,
  //     wfTemplateUUID
  //   ).then(response => {
  //     console.log("List Running Workflows RESPONSE", response);
  //     done();
  //   })
  //   .catch(error =>{
  //     console.log("List Running Workflows ERROR", error);      
  //     done(new Error(error));
  //   });  
  // });

  // it("List Workflow Templates", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Workflow.listWorkflowTemplates(
  //     accessToken
  //   ).then(response => {
  //     console.log("List Workflow Templates RESPONSE", response);
  //     done(new Error(response));
  //   })
  //   .catch(error =>{
  //     console.log("List Workflow Templates ERROR", error);      
  //     done(new Error(response));
  //   });  
  // });

  // it("Get Workflow Instance", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Workflow.getWorkflow(
  //     accessToken,
  //     wfTemplateUUID,
  //     wfInstanceUUID
  //   ).then(response => {
  //     console.log("Get Workflow Instance RESPONSE", response);
  //     done();
  //   })
  //   .catch(error =>{
  //     console.log("Get Workflow Instance ERROR", error);      
  //     done(new Error(error));
  //   });  
  // });

  // it("Get Workflow Template", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Workflow.getWorkflowTemplate(
  //     accessToken,
  //     wfTemplateUUID
  //   ).then(response => {
  //     console.log("Get Workflow Template RESPONSE", response);
  //     done();
  //   })
  //   .catch(error =>{
  //     console.log("Get Workflow Template ERROR", error);      
  //     done(new Error(error));
  //   });  
  // });

  // it("Get Workflow Instance History", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Workflow.getWfInstanceHistory(
  //     accessToken,
  //     wfInstanceUUID
  //   ).then(response => {
  //     console.log("Get Workflow Instance History RESPONSE", response);
  //     done();
  //   })
  //   .catch(error =>{
  //     console.log("Get Workflow Instance History ERROR", error);      
  //     done(new Error(error));
  //   });  
  // });

  // it("Get Workflow Template History", function (done) {
  //   if (!creds.isValid) return done();
  //   const filters = [];
  //   filters["verson"] = "0.0.1";
  //   s2sMS.Workflow.getWfTemplateHistory(
  //     accessToken,
  //     wfTemplateUUID,
  //     0,
  //     10,
  //     filters
  //   ).then(response => {
  //     console.log("Get Workflow Template History RESPONSE", response);
  //     done();
  //   })
  //   .catch(error =>{
  //     console.log("Get Workflow Template History ERROR", error);      
  //     done(new Error(error));
  //   });  
  // });

  it("Cancel Workflow Instance", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.cancelWorkflow(
      accessToken,
      wfTemplateUUID,
      wfInstanceUUID
    ).then(response => {
      //console.log("Cancel Workflow Instance RESPONSE", response);
      assert(response.status === "ok");
      done();
    })
    .catch(error =>{
      console.log("Cancel Workflow Instance ERROR", error);      
      done(new Error(error));
    });  
  });

  it("Delete Workflow Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.deleteWorkflowTemplate(
      accessToken,
      wfTemplateUUID,
      version
    ).then(response => {
      //console.log("Delete Workflow Template RESPONSE", response);
      assert(response.status === "ok");
      s2sMS.Workflow.deleteWorkflowTemplate(
        accessToken,
        wfTemplateUUID,
        "0.0.2"
      ).then(response => {
        //console.log("Delete Workflow Template RESPONSE", response);
        assert(response.status === "ok");
        done();
      })
      .catch(error =>{
        console.log("Delete Workflow Template version 0.0.2 ERROR", error);      
        done(new Error(error));
      });  
    })
    .catch(error =>{
      console.log(`Delete Workflow Template ${version} ERROR`, error);      
      done(new Error(error));
    });  
  });
});