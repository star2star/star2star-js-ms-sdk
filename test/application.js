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
        error.message === "account_uuid missing,admins array missing or empty,status missing or invalid,flows missing or not array,workspaces missing or not array,version missing"
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
        "content" :{
          "account_uuid": identityData.account_uuid,
          "status": "inactive",
          "admins": [identityData.uuid],
          "flows" : [],
          "workspaces" : [],
          "icon_color": "",
          "icon" : "",
          "version": ""
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

  it("Update Application Object", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Application.updateApplication(
        accessToken,
        objectUUID,
        {
          "name" : "Unit-Test", 
          "type" : "starpaas_application",
          "description": "Unit-Test",
          "content_type" : "application/json",
          "content" :{
            "account_uuid": identityData.account_uuid,
            "status": "active",
            "admins": [identityData.uuid],
            "flows" : [],
            "workspaces" : [],
            "icon_color": "",
            "icon" : "",
            "version": ""
         }
      }
      ).then(response => {
        //console.log("UPDATE RESPONSE", response);
        assert(response.uuid === objectUUID);
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
          response.items[thisIndex].content.status === "active" &&
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
      
      filters = [];
      filters["name"] = "Unit-"; //partial string
      filters["description"] = "unit"; //check case insensitivity
      filters["status"] = "ac"; //check status
      filters["account_uuid"] = identityData.account_uuid;
      
      s2sMS.Application.listApplications(
        accessToken,
        identityData.uuid,
        0, //offset
        1, //limit
        filters
        ).then(response => {
          //console.log("LIST RESPONSE", response);
          assert(
            response.items[0].content.status === "active" &&
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



