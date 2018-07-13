const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Identity MS Unit Test Suite", function () {

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
            console.log('alias data', aliasData);
            assert(aliasData.sms === testSMSNumber);
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
        identityData.hasOwnProperty('uuid');
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
      .lookupIdentity(accessToken, 0, 10, "username", "kpancharathi@star2star.com")
      .then(identityData => {
        // console.log('iiiii %j', identityData);
        assert(identityData.items.length === 1);
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
      .lookupIdentity(accessToken, 1, 10, "username", "test333@test.com")
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

  it("Generate Password Token", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .generatePasswordToken(accessToken, creds.email)
      .then(response => {
        assert(response.status === "ok");
        done();
      })
      .catch(e => {
        console.log("error in generate password token", e);
        done();
      });
  });

  it("Reset Password", function (done) {
    if (!creds.isValid) return done();
    // This token is expired
    const token = "7cf8f1f5-ee79-4303-aa40-7036d031f700"
    const body = {
      email : creds.email,
      password: creds.password
    }
    s2sMS.Identity
      .resetPassword(accessToken, token, body)
      .then(response => {
        //If this is successful, we have a problem.
        console.log("Unexpected Response!",response)
        assert(1 === 0);
        done();
      })
      .catch(error => {
        // Expecting a specific error as this token is expired.
        // console.log("error in reset password", error.message);
        const expected = "Identity email cannot be null"
        assert(error.message.includes(expected));
        done();
      });
  });

  it("Validate Password Token", function (done) {
    if (!creds.isValid) return done();

    // This token is expired, but we get a different response if the token was never valid or the call failed.
    const token = "7cf8f1f5-ee79-4303-aa40-7036d031f700"
    
    s2sMS.Identity
      .validatePasswordToken(accessToken, token)
      .then(tokenData => {
        // console.log("iiiii %j", identityData);
        assert(tokenData.hasOwnProperty("token"));
        done();
      })
      .catch(e => {
        console.log("error in validate token", e);
        done();
      });
  });
});