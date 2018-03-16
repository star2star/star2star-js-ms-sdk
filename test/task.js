var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function() {
  // process.env.NODE_ENV = 'dev';
  process.env.BASE_URL = "https://cpaas.star2star.net";
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("Task", function() {
  it("Get Task Templates", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Task.getTaskTemplates(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token
      ).then(responseData => {
        //console.log(identityData.token)
        //console.log(responseData)
        assert(responseData.metadata !== null);
        done();
      });
    });
  });
  it("Create / Delete Task Template", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Task.createTaskTemplate(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "foo",
        []
      ).then(responseData => {
        //console.log(identityData.token)
        //console.log(responseData)
        assert(responseData.metadata !== null);
        done();
        s2sMS.Task.deleteTaskTemplate(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          responseData.uuid
        ).then(d => {});
      });
    });
  });
  it("Create, update and  Delete Task", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Task.createTaskObject(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "title",
        [{ title: "hello" }]
      ).then(responseData => {
        //console.log(responseData);
        responseData.name = "james";

        s2sMS.Task.updateTaskObject(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          responseData.uuid,
          responseData
        ).then(updatedData => {
          assert(updatedData.name === "james");
          done();
          s2sMS.Task.deleteTaskObject(
            creds.CPAAS_KEY,
            identityData.user_uuid,
            identityData.token,
            updatedData.uuid
          ).then(d => {
            //console.log(d)
          });
        });
      });
    });
  });
  it("add task to task object", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Task.createTaskObject(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "title",
        [{ title: "hello" }]
      ).then(responseData => {
        s2sMS.Task.addTaskToTaskObject(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          responseData.uuid,
          { title: "lena" }
        ).then(newData => {
          assert(newData.content.tasks.length === 2);
          done();
          s2sMS.Task.deleteTaskObject(
            creds.CPAAS_KEY,
            identityData.user_uuid,
            identityData.token,
            newData.uuid
          ).then(d => {
            //console.log(d)
          });
        });
      });
    });
  });
  it("udpate task to task object", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Task.createTaskObject(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "title",
        [{ title: "hello" }]
      ).then(responseData => {
        //console.log(responseData)
        const z = responseData.content.tasks[0];
        z.title = "lena";
        s2sMS.Task.updateTaskInTaskObject(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          responseData.uuid,
          z
        ).then(newData => {
          //console.log('taskobject: %j', newData)
          assert(
            newData.content.tasks.length === 1 &&
              newData.content.tasks[0].title === "lena"
          );
          done();
          s2sMS.Task.deleteTaskObject(
            creds.CPAAS_KEY,
            identityData.user_uuid,
            identityData.token,
            newData.uuid
          ).then(d => {
            //console.log(d)
          });
        });
      });
    });
  });
});
