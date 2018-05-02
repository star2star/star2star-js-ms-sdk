// TODO - finish messaging unit testing

const assert = require("assert");
const s2sMS = require("../index");
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Messaging MS Test Suite", function () {

  let accessToken;

  before(function () {
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.CPAAS_API_VERSION,
        creds.email,
        creds.password
      )
      .then(oauthData => {
        const oData = JSON.parse(oauthData);
        // console.log('Got access token and identity data -[Get Object By Data Type] ', identityData, oData);
        accessToken = oData.access_token;
      });
  });

  it("Valid SMS Number", function (done) {
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
            s2sMS.Messaging.getSMSNumber(accessToken, identityData.uuid)
              .then((sms) => {
                // console.log('SSSMMMSSS', sms);
                assert(sms === testSMSNumber);
                done();
              })
              .catch((error) => {
                console.log('Error getting SMS Number', error.message);
                done(new Error(error));
              });
            s2sMS.Identity.deleteIdentity(accessToken, identityData.uuid)
              .then((d) => {
                // console.log('Deleted guest user:', identityData.uuid);
              })
              .catch((error) => {
                console.log('Error deleting user [create guest user]', error);
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

  it("GetSMS for Invalid USER UUID", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Messaging.getSMSNumber(accessToken, "bad").catch((error) => {
      console.log('Got expected error with invalid uuid [getsms for invalid user]', error.statusCode, error.message);
      assert(error.statusCode === 404);
      done();
    });
  });


  // it("Send SMS", function (done) {
  //   if (!creds.isValid) return done();
  //   s2sMS
  //     .sendSMS(
  //       creds.CPAAS_KEY,
  //       "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
  //       "msg",
  //       "+19414441241",
  //       "+19418076677"
  //     )
  //     .then(x => {
  //       //console.log(`sms sent: ${JSON.stringify(x)}`);
  //       assert(x.content[0].body === "msg");
  //       done();
  //     })
  //     .catch(z => {
  //       //console.log(z)
  //       assert(false);
  //       done();
  //     });
  // });
});