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

describe("Accounts MS Unit Test Suite", function () {

  let accessToken, accountUUID;
  let time = new Date().getTime().toString().slice(-10); //FIXME Temporary until account number from deleted accounts can be reused.

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

  it("Create Account", function (done) {
    if (!creds.isValid) return done();
    
    body = {
      "name": "Unit Test",
      "number": time,
      "type": "Reseller",
      "description": "Free form text",
      "address": {
        "line1": "123 ABC St",
        "line2": "Optional text",
        "city": "Sarasota",
        "state": "FL",
        "postal_code": "12345",
        "country": "US"
      },
      "contacts": [{
        "id":1,
        "type":"primary",
        "first_name": "First",
        "last_name": "Last",
        "email": "abc@test.com",
        "phone": "1112223333"
      }],
      "reference": "Free form text",
      "status": "Active"
    };

    s2sMS.Accounts
      .createAccount(accessToken, body)
      .then(response => {
        //console.log("Account Created: ", response);
        //save the account number for other tests
        assert(response.name === "Unit Test");
        accountUUID = response.uuid;
        done();
      })
      .catch((error) => {
        console.log("ERROR CREATING ACCOUNT",error);
        done(new Error(error));
      });
  });
  
  /*Uncomment when relationships are fixed. NH 7/30/18
  it("Create Relationship", function (done) {
    if (!creds.isValid) return done();
    
    //Test Partial Update -- Address
    body = {
      "source": {
        "name": "Unit Test",
        "type": "Reseller",
        "uuid": accountUUID
      },
      "target": {
        "name": "Unit Test",
        "type": "MasterReseller",
        "uuid": "c0b92b35-8f02-4bf8-a84d-831342b579aa"
      },
      "type": "parent"
    };

    s2sMS.Accounts
      .createRelationship(accessToken, body)
      .then(response => {
        console.log("Worked",response);
        done();
      })
      .catch(error => {
        console.log("failed",error);
        //assert(error.error.message === "Such account already has parent account");
        done();
      });
  });
*/
  it("List Accounts", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      // .listAccounts(accessToken, offset, limit, accountType, expand)
      .listAccounts(accessToken, 1, 1, "Reseller", "relationships")
      .then(accountList => {
        //console.log("accountList", accountList);
        assert(accountList.items.length === 1);
        done();
      })
      .catch((error) => {
        //console.log("error in getting account list", error);
        done(new Error(error));
      });
  });

  it("Get Account Data", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      .listAccounts(accessToken)
      .then((accountList) => {
         // console.log("accountList -- getAccountData", accountList);

        s2sMS.Accounts
          .getAccount(accessToken, accountList.items[0].uuid)
          .then(accountData => {
            // console.log("accountData", accountData);
            assert(accountData.uuid === accountList.items[0].uuid);
            done();
          })
          .catch((error) => {
            // console.log("error in getting account data", error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        //console.log("error in getting account list [getAccountData]", error);
        done(new Error(error));
      });
  });

  it("Modify Account", function (done) {
    if (!creds.isValid) return done();
    
    //Test Partial Update -- Address
    body = {
      "type": "Reseller",
      "description": "Free form text modified",
      "reference": "Free form text",
      "address": {
          "line1": "456 XYZ St",
          "line2": "Optional text modified",
          "city": "Orlando",
          "state": "FL",
          "country": "US",
          "postal_code": "67890"
      },
      "contacts": [
          {
              "uuid": "f1f45521-4501-4874-94be-3067498ee0b6",
              "type": "primary",
              "email": "abcmodified@test.com",
              "phone": "1112223333",
              "first_name": "First",
              "last_name": "Last"
          }
      ],
      "uuid": accountUUID,
      "name": "R11 Corp",
      "number": "22222"
    };
    s2sMS.Accounts
      .modifyAccount(accessToken, accountUUID, body)
      .then(status => {
        //console.log("status",status);
        assert(status.status === "ok");
        done();
      })
      .catch((error) => {
        console.log("error in getting account data", error);
        done(new Error(error));
      });
  });

  it("List Account Relationships", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      .listAccountRelationships(accessToken, accountUUID)
      .then(accountList => {
        // console.log("accountList", accountList);
        assert(accountList.items.length > 0);
        done();
      })
      .catch((error) => {
        //console.log("error in getting account list", error);
        done(new Error(error));
      });
  });

  it("Suspend Account", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      .suspendAccount(accessToken, accountUUID)
      .then(response => {
        assert(response.status === "ok")
        done();
      })
      .catch((error) => {
        done(new Error(error));
      });
  });

  it("Reinstate Account", function (done) {
    if (!creds.isValid) return done();
    
    s2sMS.Accounts
      .reinstateAccount(accessToken, accountUUID)
      .then(response => {
        assert(response.status === "ok")
        done();
      })
      .catch((error) => {
        // console.log("error in getting account data", error);
        done(new Error(error));
      });
  });

  it("Delete Account", function (done){
    if (!creds.isValid) return done();
    s2sMS.Accounts
    .deleteAccount(accessToken, accountUUID) //Test account uuid created by Create Account test
    .then(response => {
      assert(response.status === "ok");
      done();
    })
    .catch((error) => {
      //console.log("error in getting account list [getAccountData]", error);
      done(new Error(error));
    });
  });

});