var assert = require("assert");
var s2sMS = require("../identity");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

var temp_uuid;

beforeEach(function() {
  // process.env.NODE_ENV = "dev";
  process.env.BASE_URL = "https://cpaas.star2star.net";
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

describe("Identity MS", function() {
  it("Create Guest Identity", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .createIdentity(
        creds.CPAAS_KEY,
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
  it("Delete Guest Identity", function(done) {
    if (!creds.isValid && temp_uuid !== undefined) return done();
    s2sMS
      .deleteIdentity(creds.CPAAS_KEY, temp_uuid)
      .then(identityData => {
        done();
      })
      .catch(e => {
        // console.log('error', e);
        done(e);
      });
  });

  it("Login with Good Credentials", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .login(creds.CPAAS_KEY, creds.email, creds.password)
      .then(identityData => {
        assert(identityData !== null);
        done();
      });
  });
  it("Login with Bad Credentials", function(done) {
    if (!creds.isValid) return done();
    s2sMS.login(creds.CPAAS_KEY, creds.email, "bad").catch(identityData => {
      //console.log('---- %j', identityData)
      assert(identityData.statusCode === 401);
      done();
    });
  });
  it("Refresh Token", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .login(creds.CPAAS_KEY, creds.email, creds.password)
      .then(identityData => {
        // console.log('iiiii %j', identityData );
        s2sMS
          .refreshToken(creds.CPAAS_KEY, identityData.refresh_token)
          .then(refreshData => {
            // console.log('rrrrrr %j', refreshData )
            assert(refreshData !== null);
            done();
          });
      });
  });
  it("Lookup Identity with known user", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .lookupIdentity(creds.CPAAS_KEY, creds.email)
      .then(identityData => {
        // console.log('iiiii %j', identityData );
        assert(identityData.username === creds.email);
        done();
      })
      .catch(e => {
        console.log("error in lookupIdentity", e);
        done(e);
      });
  });
  it("Lookup Identity with unknown user", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .lookupIdentity(creds.CPAAS_KEY, "test333@test.com")
      .then(identityData => {
        // console.log("iiiii %j", identityData);
        assert(identityData === undefined);
        done();
      })
      .catch(e => {
        console.log("error in lookupIdentity", e);
        done();
      });
  });

  let myAccount;
  it("List Accounts", function(done) {
    if (!creds.isValid) return done();
    s2sMS
      .listAccounts(creds.CPAAS_KEY)
      .then(accountList => {
        // console.log("accountList", accountList);
        assert(accountList.length > 0);
        myAccount = accountList[0];
        done();
      })
      .catch(e => {
        console.log("error in getting account list", e);
        done(e);
      });
  });
  it("Get Account Data", function(done) {
    if (!creds.isValid && myAccount && myAccount.uuid !== undefined) return done();
    s2sMS
      .getAccount(creds.CPAAS_KEY, myAccount.uuid)
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
