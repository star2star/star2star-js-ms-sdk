const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};


const testContact = {
  "name": {
    "first": "Test",
    "last": "User"
  },
  "phone_numbers": [{
    "number": "9419998765",
    "preferred": true,
    "type": "Home"
  }]
};

describe("Contacts", function () {

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


  it("Create User Contact", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        const idData = JSON.parse(identityData);
        s2sMS.Contacts.createUserContact(
            accessToken,
            idData.user_uuid,
            testContact
          ).then(responseData => {
            // console.log('Create user contact response', responseData);
            assert(responseData.name && responseData.name.first === "Test");
            done();
            s2sMS.Contacts.deleteContact(
                accessToken,
                responseData.uuid
              ).then((d) => {
                // console.log('Deleted contact [Create User Contact]', responseData.uuid);
              })
              .catch((error) => {
                console.log('Error deleting contact [Create User Contact]', responseData.uuid, error.message);
              });
          })
          .catch((error) => {
            console.log('Error creating user contact [Create User Contact]', error.message);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting my identity data [Create User Contact]', error);
        done(new Error(error));
      });
  });

  it("Delete Contact", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        const idData = JSON.parse(identityData);
        s2sMS.Contacts.createUserContact(
            accessToken,
            idData.user_uuid,
            testContact
          ).then(responseData => {
            // console.log('Create user contact response', responseData);
            s2sMS.Contacts.deleteContact(
                accessToken,
                responseData.uuid
              ).then((d) => {
                // console.log('Deleted contact [Delete Contact]', responseData.uuid);
                done(); // done after successful delete
              })
              .catch((error) => {
                console.log('Error deleting contact [Delete Contact]', responseData.uuid, error.message);
              });
          })
          .catch((error) => {
            console.log('Error creating user contact [Delete Contact]', error.message);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting my identity data [Create User Contact]', error.message);
        done(new Error(error));
      });
  });
  it("List Contact", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        const idData = JSON.parse(identityData);
        s2sMS.Contacts.listContacts(
            idData.user_uuid,
            {}, 
            accessToken
          ).then(responseData => {
            //console.log('list contact response', responseData);
            assert(true);
            done();
          })
          .catch((error) => {
            console.log('Error listing contacts', error.message);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error getting my identity data [list contacts]', error.message);
        done(new Error(error));
      });
  });


});