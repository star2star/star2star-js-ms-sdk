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

describe("Application", function () {
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
  
  it("Create Invalid Application Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      "not an object"
    ).then(response => {
      console.log("CREATE INVALID APPLICATION RESPONSE", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE INVALID APPLICATION ERROR", error);      
      assert(
        error.message === "application must be an object" &&
        error.status === 400
      );
      done();
    });
  });

  it("Create Empty Application Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {}
    ).then(response => {
      console.log("CREATE EMPTY APPLICATION", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE EMPTY APPLICATION ERROR",error);
      assert(
        error.status === 400 &&
        error.message === "name missing or empty,name missing or empty,description missing or empty,content_type missing or incorrect,content missing or not object"
       );
      done();
    });
  });

  it("Create Application Object With No Content", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {
        "name" : "Unit-Test", 
        "type" : "starpaas_application",
        "description": "Unit-Test",
        "content_type" : "application/json"
      }
    ).then(response => {
      console.log("CREATE EMPTY APPLICATION", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE EMPTY APPLICATION ERROR",error);
      assert(
        error.status === 400 &&
        error.message === "content missing or not object"
       );
      done();
    });
  });

  it("Create Application Object With Empty Content", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {
        "name" : "Unit-Test", 
        "type" : "starpaas_application",
        "description": "Unit-Test",
        "content_type" : "application/json",
        "content" : {}
      }
    ).then(response => {
      console.log("CREATE EMPTY APPLICATION", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE EMPTY APPLICATION ERROR",error);
      assert(
        error.status === 400 &&
        error.message === "account_uuid missing,admins missing,versions missing - empty - or not an object"
       );
      done();
    });
  });

  it("Create Application Object With Empty Versions", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {
        "name" : "Unit-Test", 
        "type" : "starpaas_application",
        "description": "Unit-Test",
        "content_type" : "application/json",
        "content" : {
          "account_uuid" : identityData.account_uuid,
          "admins" : [{"uuid": identityData.uuid}],
          "versions" : {}
        }
      }
    ).then(response => {
      console.log("CREATE EMPTY VERSION", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE EMPTY VERSION ERROR",error);
      assert(
        error.status === 400 &&
        error.message === "versions missing - empty - or not an object"
       );
      done();
    });
  });

  it("Create Application Object With Invalid Versions Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {
        "name" : "Unit-Test", 
        "type" : "starpaas_application",
        "description": "Unit-Test",
        "content_type" : "application/json",
        "content" : {
          "account_uuid" : identityData.account_uuid,
          "admins" : [{"uuid": identityData.uuid}],
          "icon_color": "",
          "icon" : "",
          "versions" : {
            "1.23.99": {
              "flows":[],
              "workspaces":[],
              "status": "inactive"
            },
            "invalid" : {
              "flows": "",
              "workspaces":{},
              "status": "invalid status"
            }
          }
        }
      }
    ).then(response => {
      console.log("CREATE INVALID VERSION", response);
      done(new Error(response));
    })
    .catch(error =>{
      //console.log("CREATE INVALID VERSION ERROR",error);
      assert(
        error.status === 400 &&
        error.message === "version \"invalid\" invalid format,version \"invalid\" flows missing or not array,"+
        "version \"invalid\" workspaces missing or not array,version \"invalid\" status missing or invalid"
       );
      done();
    });
  });
  
  it("Create Application Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.createApplication(
      accessToken,
      identityData.uuid,
      {
        "name" : "Unit-Test", 
        "type" : "starpaas_application",
        "description": "Unit-Test",
        "content_type" : "application/json",
        "content" : {
          "account_uuid" : identityData.account_uuid,
          "admins" : [{"uuid": identityData.uuid}],
          "icon_color": "",
          "icon" : "",
          "versions" : {
            "1.0.0": {
              "flows":[],
              "workspaces":[],
              "status": "inactive"
            },
            "1.0.1" : {
              "flows": [],
              "workspaces":[],
              "status": "inactive"
            }
          }
        }
      }
    ).then(response => {
      //console.log("Object Create: RESPONSE", response);
      objectUUID = response.uuid;
      //TODO expand these.....nh 08-22-18
      assert(
        response.hasOwnProperty("name") &&
        response.hasOwnProperty("type") &&
        response.hasOwnProperty("type") &&
        response.hasOwnProperty("content")
      );
      done();
    })
    .catch(error =>{
      //console.log("ERROR",error);
      done(new Error(error));
    });
  });

  it("Modify Application Object", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Application.modifyApplication(
        accessToken,
        objectUUID,
        {
          "name" : "Unit-Test-Modify", 
          "type" : "starpaas_application",
          "description": "Unit-Test",
          "content_type" : "application/json",
          "content" : {
            "account_uuid" : identityData.account_uuid,
            "admins" : [{"uuid": identityData.uuid}],
            "icon_color": "",
            "icon" : "",
            "versions" : {
              "1.0.0": {
                "flows":[],
                "workspaces":[],
                "status": "active"
              },
              "1.0.1" : {
                "flows": [],
                "workspaces":[],
                "status": "inactive"
              }
            }
          }
        }
      ).then(response => {
        //console.log("MODIFY RESPONSE", response);
        assert(
          response.name === "Unit-Test-Modify" &&
          response.content.account_uuid === identityData.account_uuid
        );
        done();
      })
      .catch(error => {
        console.log("ERROR", error);
        done(new Error(error));
      });
    });

  it("Get Application Object", function (done) {
    if (!creds.isValid) return done();
    setTimeout(() => {
      s2sMS.Application.getApplication(
        accessToken,
        objectUUID
        ).then(response => {
          //console.log("RESPONSE", response);
          assert(response.uuid === objectUUID);
          done();
        })
        .catch(error => {
          console.log("ERROR", error);
          done(new Error(error));
          });
      }, 2000);
    });

  it("List Application Objects", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Application.listApplications(
      accessToken,
      identityData.uuid,
      0, //offset
      100 //limit
      ).then(response => {
        //console.log("LIST RESPONSE", response);
        const thisIndex = response.items.findIndex(item => {
          return item.uuid === objectUUID;
        });
        assert(
          response.items[thisIndex].name === "Unit-Test-Modify" &&
          response.items[thisIndex].content.account_uuid === identityData.account_uuid
        );
        done();
      })
      .catch(error => {
        console.log("ERROR", error);
        done(new Error(error));
        });
    });

    it("List Application Objects With Filters", function (done) {
      if (!creds.isValid) return done();
      
      const filters = [];
      filters["name"] = "Unit-"; //partial string
      filters["description"] = "unit"; //check case insensitivity
      filters["status"] = "ac"; //check status
      filters["account_uuid"] = identityData.account_uuid;
      
      s2sMS.Application.listApplications(
        accessToken,
        identityData.uuid,
        0, //offset
        2, //limit
        filters
        ).then(response => {
          //console.log("LIST RESPONSE WITH FILTERS", response);
          assert(
            response.items[0].content.versions["1.0.0"].status === "active" && 
            response.items[0].content.account_uuid === identityData.account_uuid &&
            response.items[0].uuid === objectUUID &&
            response.metadata.total === 1
          );
          done();
        })
        .catch(error => {
          console.log("ERROR", error);
          done(new Error(error));
          });
      });

  it("Delete Application Object", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Application.deleteApplication(
        accessToken,
        objectUUID
      ).then(response => {
        //console.log("RESPONSE", response);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        console.log("ERROR", error);
        done(new Error(error));
      });
    });
});



