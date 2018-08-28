var assert = require("assert");
var s2sMS = require("../src");
var fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Workflow", function () {
  let accessToken, identityData, objectUUID;

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

  const validTemplateBody = {
    "name": "Unit-Test",
    "description": "Unit-Test",
    "status": "inactive",
    "states": [
      {"type": "normal"},
    ],
      "transitions": [
      {"type": "normal"}
    ] 
    };

  it("Create Workflow With No Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken
    ).then(response => {
      console.log("Create Workflow With No Template RESPONSE", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("Create Workflow With No Template ERROR", error);      
      assert(
        error.message === "template missing or not object" &&
        error.status === 400
      );
      done();
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
      //console.log("Create Workflow With Empty Template ERROR", error);      
      assert(
        error.message === "name missing or empty,description missing or empty,status missing or invalid,states missing or not array,transitions missing or not array" &&
        error.status === 400
      );
      done();
    });
  });

  it("Create Workflow With Invalid Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Workflow.createWorkflowTemplate(
      accessToken,
      {
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
      }
    ).then(response => {
      console.log("Create Workflow With Invalid Template", response);
      done(new Error(response));
    })
    .catch(error =>{
      console.log("Create Workflow With Invalid Template", error);      
      // assert(
      //   error.message === "status missing or invalid,state 0 uuid missing or empty,state 0 name missing or empty,state 1 uuid missing or empty,state 1 name missing or empty,state 1 type missing or invalid,transition 0 uuid missing or empty,transition 0 name missing or empty,transition 0 start_state missing or empty,transition 0 next_state missing or empty,transition 1 uuid missing or empty,transition 1 name missing or empty,transition 1 start_state missing or empty,transition 1 next_state missing or empty,transition 1 type missing or invalid" &&
      //   error.status === 400
      // );
      done();
    });
  });

});