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

  it("Create Account", function (done) {
    if (!creds.isValid) return done();
    
    body = {
      "name": "MR1 Corp",
      "number": "111111",
      "type": "MasterReseller",
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
        //We are testing for a specific failure here since we cannot duplicate the account creation.
        //Confirming the validation failure message as his should not work.
        done(new Error(response));
      })
      .catch((error) => {
        //console.log("ERROR",error.error.details[0].number);
        assert(error.error.details[0].number === "Account with such number already exists");
        done();
      });
  });
  
  it("Create Relationship", function (done) {
    if (!creds.isValid) return done();
    
    //Test Partial Update -- Address
    body = {
      "source": {
        "name": "MR1 Corp",
        "type": "MasterReseller",
        "uuid": "c6e34c50-05f3-44a8-8b0e-b993292ec891"
      },
      "target": {
        "name": "R11 Corp",
        "type": "Reseller",
        "uuid": "ff591bba-630b-43e0-9f5b-3c110ade3bdf"
      },
      "type": "parent"
    };

    s2sMS.Accounts
      .createRelationship(accessToken, body)
      .then(response => {
        //We are testing for a specific failure here since we cannot duplicate the relationship creation.
        //Confirming the validation failure message as his should not work.
        done(new Error(response));
      })
      .catch((error) => {
        assert(error.error.message === "Such account already has parent account");
        done();
      });
  });

  it("List Accounts", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      // .listAccounts(accessToken, accountType, expand, offset, limit)
      .listAccounts(accessToken, "Reseller", 1, 1, "accounts")
      .then(accountList => {
        // console.log("accountList", accountList);
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
      "line1": "456 XYZ St",
      "line2": "Optional text",
      "city": "Orlando",
      "state": "FL",
      "postal_code": "67890",
      "country": "US"
    };
    property = "address"

    s2sMS.Accounts
      .listAccounts(accessToken)
      .then((accountList) => {
        //console.log("accountList", accountList);

        s2sMS.Accounts
          .modifyAccount(accessToken, accountList.items[0].uuid, body, property)
          .then(status => {
            //console.log("status",status);
            assert(status.status === "ok");
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

  it("List Account Relationships", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      .listAccountRelationships(accessToken, "2af40dde-5492-4a54-a99c-25a067532a89")
      .then(accountList => {
        //console.log("accountList", accountList);
        assert(accountList.items.length > 0);
        done();
      })
      .catch((error) => {
        //console.log("error in getting account list", error);
        done(new Error(error));
      });
  });
});