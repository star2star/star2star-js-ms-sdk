var assert = require("assert");
var s2sMS = require("../index");
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

describe("ShortUrls", function () {
  it("list", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.ShortUrls.list(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token
      ).then(responseData => {
        //console.log(responseData)
        assert(responseData.metadata !== null);
        done();
      });
    });
  });
  it("create / delete ", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      const options = {
        url: "http://www.google.com"
      };
      s2sMS.ShortUrls.create(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        identityData.token,
        options
      ).then(responseData => {
        // console.log(responseData);
        assert(responseData.short_code.length > 0);
        s2sMS.ShortUrls.deleteShortCode(
          creds.CPAAS_KEY,
          identityData.user_uuid,
          identityData.token,
          responseData.short_code
        );
        done();
      });
    });
  });
});