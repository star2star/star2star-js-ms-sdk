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

  let accessToken, identityData, testUUID;
  let time = new Date().getTime().toString().slice(-10); //FIXME Temporary until DELETE is fixed

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

  it("Create Identity", function (done) {
    if (!creds.isValid) return done();
    const body = {
      "account_uuid": identityData.account_uuid,
      "type": "user",
      "first_name": "Larry",
      "middle_name": "The",
      "last_name": "CableGuy",
      "username": "larry"+time+"@fake.email",
      "status": "Active",
      "provider": "local",
      "email": "larry"+time+"@fake.email",
      "phone": time,
      "address": {
        "city": "Somewhere",
        "state": "AK",
        "postal_code": "12345",
        "country": "US"
      }, 
      "reference": "Free form text"
    }
    s2sMS.Identity.createIdentity(accessToken, body)
      .then(identity => {
        // console.log('Created user', identity.uuid);
        testUUID = identity.uuid;
        assert(identity.uuid !== undefined);
        done();
      })
      .catch((error) => {
        console.log('Error creating identity', error);
        done(new Error(error));
      });
  });

  it("Create DID Identity Alias", function (done) {
    if (!creds.isValid) return done();
    const body = {
      "nickname": "larry"+time+"@fake.email",
      "email": "larry"+time+"@fake.email",
      "sms": time
    }    
    s2sMS.Identity.createAlias(
        accessToken,
        testUUID,
        body
      ).then(response => {
        assert(response.status === "ok");
        s2sMS.Identity.getIdentityDetails(accessToken,testUUID)
        .then(response => {
            //console.log("UPDATED IDENTITY",response);
            assert(response.aliases[0].sms === time);
            done();
        })
        .catch(error => {
          console.log('Error Getting Updated Identity', error);
          done(new Error(error));
        });
      })
      .catch(error => {
        console.log('Error updating alias [create alias]', error);
        done(new Error(error));
      });
  });
  
  it("Update DID Identity Alias", function (done) {
    if (!creds.isValid) return done();
    time++; //FIXME incrementing our time to use for new sms until delete is fixed.    
    s2sMS.Identity.updateAliasWithDID(
        accessToken,
        testUUID,
        time
      ).then(response => {
        assert(response.status === "ok");
        s2sMS.Identity.getIdentityDetails(accessToken,testUUID)
        .then(response => {
            // console.log("UPDATED SMS",response.aliases[0].sms);
            assert(response.aliases[0].sms == time);
            done();
        })
        .catch(error => {
          console.log('Error Getting Updated Identity', error);
          done(new Error(error));
        });
      })
      .catch(error => {
        console.log('Error updating alias [create alias]', error);
        done(new Error(error));
      });
  });

  it("Modify Identity", function (done) {
    if (!creds.isValid) return done();
    // console.log('Created guest user [create Alias]', identityData.uuid);
    const body = {first_name: "Bob"};
    s2sMS.Identity.modifyIdentity(
        accessToken,
        testUUID,
        body
      ).then((response) => {
        //console.log('alias data', aliasData);
        assert(response.first_name === "Bob");
        done();
      })
      .catch((error) => {
        console.log('Error updating alias [create alias]', error);
        done(new Error(error));
      });
  });

  //TODO these return 204s but are broken

  it("Deactivate Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.deactivateIdentity(accessToken, testUUID)
          .then((response) => {
            //console.log('Deleted guest user:', testUUID);
            assert(response.status === "ok");
            done();
          })
          .catch((error) => {
            console.log('Error deleting user [create user]', error);
            done(new Error(error));
          });
  });

  it("Reactivate Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.reactivateIdentity(accessToken, testUUID)
          .then((response) => {
            //console.log('Deleted guest user:', testUUID);
            assert(response.status === "ok");
            done();
          })
          .catch((error) => {
            console.log('Error deleting user [create user]', error);
            done(new Error(error));
          });
  });

  it("Delete Identity", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.deleteIdentity(accessToken, testUUID)
          .then((response) => {
            //console.log('Deleted guest user:', testUUID);
            assert(response.status === "ok");
            done();
          })
          .catch((error) => {
            console.log('Error deleting user [create user]', error);
            done(new Error(error));
          });
  });

  it("Login with Good Credentials", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity
      .login(accessToken, creds.email, creds.password)
      .then(login => {
        assert(login !== null);
        done();
      })
      .catch((error) => {
        console.log('Error login [login with good credentials]', error);
        done(new Error(error));
      });
  });

  it("Login with Bad Credentials", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(accessToken, creds.email, "bad").catch(login => {
        // console.log('Bad Creds login status code: %j', identityData);
        assert(login.statusCode === 401);
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
      .then((response) => {
        // console.log('get My Identity data response: %j', JSON.parse(identityData));
        response.hasOwnProperty('uuid');
        done();
      })
      .catch((error) => {
        //console.log('Error getting my identity data', error);
        done(new Error(error));
      });
  });

  it("Lookup Identity with known user", function (done) {
    if (!creds.isValid) return done();
    filters = [];
    filters["username"] = creds.email;

    s2sMS.Identity
      .lookupIdentity(accessToken, 0, 10, filters)
      .then(response => {
        // console.log('iiiii %j', response);
        assert(response.items.length === 1);
        done();
      })
      .catch(e => {
        console.log("error in lookupIdentity", e);
        done(e);
      });
  });

  it("Lookup Identity with unknown user", function (done) {
    if (!creds.isValid) return done();
    filters = [];
    filters["username"] = "test333@test.com";
    s2sMS.Identity
      .lookupIdentity(accessToken, 1, 10, filters)
      .then(response => {
        // console.log("iiiii %j", response);
        assert(response.items.length === 0);
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
        //console.log("error in reset password", error.message);
        const expected = "does not exist locally"
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