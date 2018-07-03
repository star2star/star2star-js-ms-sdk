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

describe("Task", function () {
  let accessToken, identityData;

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
     })
  });

  it("Get Task Templates", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Task.getTaskTemplates(
      identityData.uuid,
      accessToken
    ).then(responseData => {
      //console.log(identityData.token)
      //console.log(responseData)
      assert(responseData.metadata !== null);
      done();
    });
  });
  
  it("Create / Delete Task Template", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Task.createTaskTemplate(
      identityData.uuid,
      accessToken,
      "foo", 
      "description of template", 
      []
    ).then(responseData => {
      //console.log(identityData.token)
      //console.log(responseData)
      assert(responseData.metadata !== null);
      done();
      s2sMS.Task.deleteTaskTemplate(
        accessToken,
        responseData.uuid
      ).then(d => {});
    }).catch((e)=>{
      done(e);
    });

  });
  
  it("Create, update and  Delete Task", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "default desc",
      [{
        title: "hello"
      }]
    ).then(responseData => {
      //console.log(responseData);
      responseData.name = "james";

      s2sMS.Task.updateTaskObject(
        accessToken,
        responseData.uuid,
        responseData
      ).then(updatedData => {
        assert(updatedData.name === "james");
        done();
        s2sMS.Task.deleteTaskObject(
          accessToken,
          updatedData.uuid
        ).then(d => {
          //console.log(d)
        });
      });
    });

  });
 
  it("add task to task object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "default descripiont here", 
      [{
        title: "hello"
      }]
    ).then(responseData => {
      s2sMS.Task.addTaskToTaskObject(
        accessToken,
        responseData.uuid, {
          title: "lena"
        }
      ).then(newData => {
        assert(newData.content.tasks.length === 2);
        done();
        s2sMS.Task.deleteTaskObject(
          accessToken,
          newData.uuid
        ).then(d => {
          //console.log(d)
        });
      });
    });
  });
 
  it("udpate task to task object", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "dddddd", 
      [{
        title: "hello"
      }]
    ).then(responseData => {
      // console.log("rrrrr %j", responseData);
      const z = responseData.content.tasks[0];
      z.title = "lena";
      s2sMS.Task.updateTaskInTaskObject(
        accessToken,
        responseData.uuid,
        z
      )
      .then(newData => {
        //console.log('taskobject: %j', newData)
        assert(
          newData.content.tasks.length === 1 &&
          newData.content.tasks[0].title === "lena"
        );
        done();
        s2sMS.Task.deleteTaskObject(
          accessToken,
          newData.uuid
        );
      }).catch(e => {
        console.log("uh oh....", e);
        done(e);
      });
    });

  });
  
});