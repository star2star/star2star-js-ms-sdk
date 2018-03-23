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

describe("Event", function() {
  it("list Events ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Event.listEvents(
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
  it("Create, update and  Delete Event", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Event.createEvent(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "title",
        { a: 1, b: 2 }
      ).then(responseData => {
        // console.log('1111 %j', responseData);
        responseData.name = "james";
        s2sMS.Event.updateEvent(
          creds.CPAAS_KEY,
          identityData.token,
          responseData.uuid,
          responseData
        ).then(updatedData => {
          // console.log('----- %j', updatedData)
          assert(updatedData.name === "james");
          done();
          s2sMS.Event.deleteEvent(
            creds.CPAAS_KEY,
            identityData.token,
            updatedData.uuid
          ).then(d => {
            //console.log(d)
          });
        });
      });
    });
  });
  it("Create and Get / Delete ", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      s2sMS.Event.createEvent(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        "title",
        { a: 1, b: 2 }
      ).then(responseData => {
        //console.log('1111 %j', responseData);
        s2sMS.Event.getEvent(
          creds.CPAAS_KEY,
          identityData.token,
          responseData.uuid
        ).then(getData => {
          assert(getData.uuid === responseData.uuid);
          done();
          s2sMS.Event.deleteEvent(
            creds.CPAAS_KEY,
            identityData.token,
            responseData.uuid
          ).then(d => {
            //console.log(d)
          });
        });
      });
    });
  });
});
