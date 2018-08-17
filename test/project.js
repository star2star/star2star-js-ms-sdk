var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Project", function () {
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
  
  it("Create Project Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Project.createProjectObject(
      accessToken,
      identityData.uuid,
      "title", 
      "default desc",
      {"key" : "value"}
    ).then(response => {
      //console.log("Object Create: RESPONSE", response);
      objectUUID = response.uuid;
      assert(
        response.hasOwnProperty("name") &&
        response.hasOwnProperty("type")
      );
      done();
    })
    .catch(error =>{
      //console.log("ERROR",error);
      done(new Error(error));
    });
  });

  it("Update Project Object", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Project.updateProjectObject(
        accessToken,
        objectUUID,
        {
          "content": {
            "newKey": "new value"
          }
        }
      ).then(response => {
        //console.log("RESPONSE", response);
        assert(response.uuid === objectUUID);
        done();
      })
      .catch(error => {
        //console.log("ERROR", error);
        done(new Error(error));
      });
    });

  it("Get Project Object", function (done) {
    if (!creds.isValid) return done();
    setTimeout(() => {
      s2sMS.Project.getProjectObject(
        accessToken,
        objectUUID
        ).then(response => {
          //console.log("RESPONSE", response);
          assert(response.content.newKey === "new value");
          done();
        })
        .catch(error => {
          console.log("ERROR", error);
          done(new Error(error));
          });
      }, 2000);
    });

  it("Delete Project Object", function (done) {
    if (!creds.isValid) return done();
      s2sMS.Project.deleteProjectObject(
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