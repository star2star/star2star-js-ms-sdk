var assert = require("assert");
var s2sMS = require("../src/index");
var fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Media Test Suite", function () {

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
 
  it("List user Media", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Media.listUserMedia(
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
        console.log('Error list groups [list groups]', error);
        done(new Error(error));
      });
  });
  
  let file_id = undefined; 
  it("Upload user Media", function (done) {
    if (!creds.isValid) return done();
    const fileName = "git-cheat-sheet.png";
    s2sMS.Media.uploadFile(
        fileName,
        fs.createReadStream('./test/media.js'), 
        "0904f8d5-627f-4ff5-b34d-68dc96487b1e",
        accessToken
      ).then(responseData => {
        //console.log(responseData);
        // TODO other asserts?
        //console.log('>>>>>>', fileName.indexOf(responseData['file_name']) < 0, fileName.indexOf(responseData['file_name']) )
        assert(responseData.hasOwnProperty('file_id'), `missing file_id from results ${JSON.stringify(responseData)}`);
        assert(fileName.indexOf(responseData['file_name']) > -1 , `missing file_name ${fileName} from results  ${responseData['file_name']}`);
        done();
        file_id = responseData['file_id'];

      })
      .catch((error) => {
        console.log('Error Upload User File', error);
        done(new Error(error));
      });
  });
  it("delete user Media", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Media.deleteMedia(file_id, accessToken)
    .then((x)=>{
      //console.log(`deleted ${file_id}`)
      assert(true);
      done();
    })
    .catch((e)=>{
      assert(false, e);
      done();

    });
  });

});