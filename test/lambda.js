const assert = require("assert");
const s2sMS = require("../src/index");
const config = require("../src/utilities").config;
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Lambda MS", function () {

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

  it("invokeGoodLambda", function (done) {
    if (!creds.isValid) return done();
    const params = {
      a: 1,
      b: "test"
    };

    s2sMS.Lambda.invokeLambda(accessToken, "abc", params)
      .then(lambdaResponse => {
        // console.log('Response from invokeLambda [invokeGoodLambda]', lambdaResponse)
        const validResponse = {
          message: "abc successfully finished",
          parameters: params
        };
        assert.deepEqual(lambdaResponse, validResponse);
        done();
      })
      .catch((error) => {
        console.log('Error invoking valid lambda [invoke good lambda]', error);
        done(new Error(error));
      });
  });

  it("invokeBadLambda", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Lambda.invokeLambda(accessToken, "this one does not exists", {
        env: "dev"
      })
      .catch(lambdaResponse => {
        //console.log(lambdaResponse)
        assert.equal(lambdaResponse.statusCode, 404);
        done();
      });
  });

  // TODO - do we need this test????
  // it("invoke default-all-notify lambda", function (done) {
  //   if (!creds.isValid) return done();
  //   const params = {
  //     params: {
  //       title: "911: ",
  //       body: "Called from zone: SRQ Main extension: Room 2701 at Thu Nov 16 2017 16:10:19 GMT+0000 (UTC) "
  //     },
  //     cfg: {
  //       _outDataSamples: ["5a0db856818133001743490d"],
  //       _selectedDataSamples: [],
  //       _account: "59fcdca30f014f001733fda1",
  //       CPAAS_KEY: "588a5e9bf5612d00d8eb7df1e29a4b390b1448a66324533c29dce7ec",
  //       email: "jschimmoeller@schimmoeller.net",
  //       password: "2017star"
  //     },
  //     config: config,
  //     subscribers: [{
  //       uuid: "1",
  //       name: "James",
  //       modality: "sms",
  //       value: "+19418076677"
  //     }],
  //     env: "dev"
  //   };
  // 
  //   s2sMS.Lambda.invokeLambda(creds.CPAAS_KEY, "default-all-notify", params)
  //     .then(lambdaResponse => {
  //       //console.log('=======', lambdaResponse)
  //       const validResponse = "sms successfully finished";
  //       assert.deepEqual(lambdaResponse.message, validResponse);
  //       done();
  //     })
  //     .catch(e => {
  //       console.log("-----", e);
  //       assert(false);
  //       done();
  //     });
  // });

});