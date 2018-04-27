var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");


var creds = {
  CPAAS_KEY: "yourkeyhere",
  CPAAS_IDENTITY_KEY: "id key here",
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};


describe("Identity MS Unit Test Suite", function () {

  // variable with 'guest' user_uuid used in testing
  var temp_uuid;

  before(function () {
    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");

    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }
  });

  it("Create Guest Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .createIdentity(
        creds.CPAAS_IDENTITY_KEY,
        "testEmail@star2star.com",
        "guest",
        "pwd1"
      )
      .then(identityData => {
        // console.log('Created guest user', identityData.uuid);
        temp_uuid = identityData ? identityData.uuid : undefined;
        assert(
          identityData.uuid !== undefined &&
          identityData.username === "testEmail@star2star.com" &&
          identityData.type.guest !== undefined
        );
        done();
      });
  });

  it("Delete Guest Identity", function (done) {
    if (!creds.isValid && temp_uuid !== undefined) return done();
    s2sMS.Identity
      .deleteIdentity(creds.CPAAS_IDENTITY_KEY, temp_uuid)
      .then(identityData => {
        done();
      })
      .catch(e => {
        // console.log('error', e);
        done(e);
      });
  });

  it("Login with Good Credentials", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .login(creds.CPAAS_IDENTITY_KEY, creds.email, creds.password)
      .then(identityData => {
        assert(identityData !== null);
        done();
      });
  });

  // it("Login with Bad Credentials", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Identity.login(creds.CPAAS_IDENTITY_KEY, creds.email, "bad").catch(identityData => {
  //     console.log('---- %j', identityData)
  //     assert(identityData.statusCode === 401);
  //     done();
  //   });
  // });

  it("Lookup Identity with known user", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .lookupIdentity(creds.CPAAS_IDENTITY_KEY, creds.email)
      .then(identityData => {
        // console.log('iiiii %j', identityData);
        assert(identityData.items[0].properties.email === creds.email);
        done();
      })
      .catch(e => {
        console.log("error in lookupIdentity", e);
        done(e);
      });
  });
  it("Lookup Identity with unknown user", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .lookupIdentity(creds.CPAAS_IDENTITY_KEY, "test333@test.com")
      .then(identityData => {
        // console.log("iiiii %j", identityData);
        assert(identityData.items.length === 0);
        done();
      })
      .catch(e => {
        console.log("error in lookupIdentity", e);
        done();
      });
  });

  let myAccount;
  it("List Accounts", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .listAccounts(creds.CPAAS_IDENTITY_KEY)
      .then(accountList => {
        // console.log("accountList", accountList);
        assert(accountList.items.length > 0);
        myAccount = accountList.items[0];
        done();
      })
      .catch(e => {
        console.log("error in getting account list", e);
        done(e);
      });
  });
  it("Get Account Data", function (done) {
    if (!creds.isValid && myAccount && myAccount.uuid !== undefined) return done();
    s2sMS.Identity
      .getAccount(creds.CPAAS_IDENTITY_KEY, myAccount.uuid)
      .then(accountData => {
        // console.log("accountData", accountData);
        assert(accountData.uuid === myAccount.uuid);
        done();
      })
      .catch(e => {
        console.log("error in getting account data", e);
        done(e);
      });
  });


});