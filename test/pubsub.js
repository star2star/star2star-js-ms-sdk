var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");

var creds = {
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("PubSub Test Suite", function () {

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
    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return new Promise((resolve, reject)=>{
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
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
 
  it("List user subscriptions", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Pubsub.listUserSubscriptions(
        "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
        accessToken
      ).then(responseData => {
        //console.log(responseData);
        // TODO other asserts?
        assert(
          responseData.hasOwnProperty('items') &&
          responseData.hasOwnProperty('metadata')
        );
        done();
      })
      .catch((error) => {
        console.log('Error list user subscriptions', error);
        done(new Error(error));
      });
  });

  let sub_uuid; 

  it("add subscription", function (done) {
    if (!creds.isValid) return done();
    const subscriptions = {
        identity: ["identity_property_change"]
    }

    s2sMS.Pubsub.addSubscription( 
        "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
        "47113ee7-ddbe-4388-aade-717c36ec17c7",
        "http://localhost:8001/foo",
        [],
        subscriptions, 
        accessToken
      ).then(responseData => {
        //console.log(responseData);
        // TODO other asserts?
        sub_uuid = responseData.subscription_uuid;

        assert(responseData.hasOwnProperty('subscription_uuid'), "add subscription failed ... no subscription uuid found" );
        done();
      })
      .catch((error) => {
        console.log('Error adding subscription', error);
        done(new Error(error));
      });
  });

  it("delete subscription", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Pubsub.deleteSubscription( 
        sub_uuid, 
        accessToken
      ).then(responseData => {
        //console.log(responseData);
        assert(true );
        done();
      })
      .catch((error) => {
        console.log('Error deleting subscription', error);
        done(new Error(error));
      });
  });
});