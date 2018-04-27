var assert = require("assert");
var s2sMS = require("../messaging");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function () {
  s2sMS.setMsHost("https://cpaas.star2starglobal.net");
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("Messaging MS", function () {
  it("Valid SMS Number", function (done) {
    if (!creds.isValid) return done();
    s2sMS
      .getSMSNumber(creds.CPAAS_KEY, "0904f8d5-627f-4ff5-b34d-68dc96487b1e")
      .then(sms => {
        assert(sms === "+19414441241");
        done();
      });
  });
  it("Invalid USER UUID", function (done) {
    if (!creds.isValid) return done();
    s2sMS.getSMSNumber(creds.CPAAS_KEY, "bad").catch(() => {
      assert(true);
      done();
    });
  });
  it("Send SMS", function (done) {
    if (!creds.isValid) return done();
    s2sMS
      .sendSMS(
        creds.CPAAS_KEY,
        "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
        "msg",
        "+19414441241",
        "+19418076677"
      )
      .then(x => {
        //console.log(`sms sent: ${JSON.stringify(x)}`);
        assert(x.content[0].body === "msg");
        done();
      })
      .catch(z => {
        //console.log(z)
        assert(false);
        done();
      });
  });
});