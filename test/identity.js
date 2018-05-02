const assert = require("assert");
const s2sMS = require("../index");
const fs = require("fs");


var creds = {
  CPAAS_KEY: "yourkeyhere",
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Identity MS Unit Test Suite", function () {

  let accessToken;

  before(function () {
    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");

    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    return s2sMS.Oauth.getAccessToken(
      creds.CPAAS_OAUTH_KEY,
      creds.CPAAS_OAUTH_TOKEN,
      creds.CPAAS_API_VERSION,
      creds.email,
      creds.password
    ).then((oauthData) => {
      const oData = JSON.parse(oauthData);
      // console.log('Got access token and identity data -[Get Object By Data Type] ', identityData, oData);
      accessToken = oData.access_token;
    });
  });

  it("Create Guest Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.createIdentity(
        accessToken,
        "testEmail@star2star.com",
        "guest",
        "pwd1"
      )
      .then(identityData => {
        // console.log('Created guest user', identityData.uuid);
        assert(
          identityData.uuid !== undefined &&
          identityData.username === "testEmail@star2star.com" &&
          identityData.type.guest !== undefined
        );
        done();
        s2sMS.Identity.deleteIdentity(accessToken, identityData.uuid)
          .then((d) => {
            // console.log('Deleted guest user:', identityData.uuid);
          })
          .catch((error) => {
            console.log('Error deleting user [create guest user]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error create guest identity', error);
        done(new Error(error));
      });
  });

  it("Add DID Identity Alias", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.createIdentity(
        accessToken,
        "testEmail2@star2star.com",
        "guest",
        "pwd1"
      )
      .then((identityData) => {
        // console.log('Created guest user [create Alias]', identityData.uuid);
        const testSMSNumber = "941-999-8765";
        s2sMS.Identity.updateAliasWithDID(
            accessToken,
            identityData.uuid,
            testSMSNumber
          ).then((aliasData) => {
            // console.log('alias data', aliasData);
            assert(JSON.parse(aliasData).sms === testSMSNumber);
            done();
            s2sMS.Identity.deleteIdentity(accessToken, identityData.uuid)
              .then((d) => {
                // console.log('Deleted guest user:', identityData.uuid);
              })
              .catch((error) => {
                console.log('Error deleting user [create guest user]', error);
                done(new Error(error));
              });

          })
          .catch((error) => {
            console.log('Error updating alias [create alias]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error create guest identity', error);
        done(new Error(error));
      });
  });



  it("Delete Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.createIdentity(
        accessToken,
        "testEmailForDelete@star2star.com",
        "guest",
        "pwd1"
      )
      .then(identityData => {
        // console.log('Created guest user [delete user]', identityData.uuid);
        s2sMS.Identity.deleteIdentity(accessToken, identityData.uuid)
          .then((d) => {
            // console.log('Deleted guest user [delete user]:', identityData.uuid);
            // done when delete resolves
            done();
          })
          .catch((error) => {
            console.log('Error deleting user [delete user]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error create guest identity [delete user]', error);
        done(new Error(error));
      });
  });

  it("Login with Good Credentials", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .login(accessToken, creds.email, creds.password)
      .then(identityData => {
        assert(identityData !== null);
        done();
      })
      .catch((error) => {
        console.log('Error login [login with good credentials]', error);
        done(new Error(error));
      });
  });

  it("Login with Bad Credentials", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(accessToken, creds.email, "bad").catch(identityData => {
        // console.log('Bad Creds login status code: %j', identityData);
        assert(identityData.statusCode === 401);
        done();
      })
      .catch((error) => {
        //console.log('Error logging in with BAD credentials', error);
        done(new Error(error));
      });
  });

  it("Get My Identity Data", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        // console.log('get My Identity data response: %j', JSON.parse(identityData));
        assert(JSON.parse(identityData).hasOwnProperty('user_uuid'));
        done();
      })
      .catch((error) => {
        //console.log('Error getting my identity data', error);
        done(new Error(error));
      });
  });



  it("Lookup Identity with known user", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .lookupIdentity(accessToken, creds.email)
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
      .lookupIdentity(accessToken, "test333@test.com")
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

  it("List Accounts", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Identity
      .listAccounts(accessToken)
      .then(accountList => {
        // console.log("accountList", accountList);
        assert(accountList.items.length > 0);
        done();
      })
      .catch((error) => {
        console.log("error in getting account list", error);
        done(new Error(error));
      });
  });

  it("GetAccountData", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Identity
      .listAccounts(accessToken)
      .then((accountList) => {
        // console.log("accountList -- getAccountData", accountList);

        s2sMS.Identity
          .getAccount(accessToken, accountList.items[0].uuid)
          .then(accountData => {
            // console.log("accountData", accountData);
            assert(accountData.uuid === accountList.items[0].uuid);
            done();
          })
          .catch((error) => {
            console.log("error in getting account data", error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log("error in getting account list [getAccountData]", error);
        done(new Error(error));
      });
  });
});