var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

beforeEach(function() {
  //process.env.NODE_ENV = 'dev';
  process.env.BASE_URL = "https://cpaas.star2star.net";
  // file system uses full path so will do it like this
  if (fs.existsSync("./test/credentials.json")) {
    // do not need test folder here
    creds = require("./credentials.json");
  }
});

const testContact = {
  "name": {
    "first": "Test",
    "last": "User"
  },
  "phone_numbers": [
    {
      "number": "941-999-8765",
      "preferred": true,
      "type": "Home"
    }
  ]
};

let testContactUUID;

describe("Contacts", function() {
  it("Create User Contact", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      //console.log(identityData)
      s2sMS.Contacts.createUserContact(
        creds.CPAAS_KEY,
        identityData.user_uuid,
        testContact
      ).then(responseData => {
        //console.log('rrrrr', responseData);
        testContactUUID = responseData.uuid;
        assert(responseData.name && responseData.name.first === "Test");
        done();
      });
    });
  });
  it("Delete Contact", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Contacts.deleteContact(
      creds.CPAAS_KEY,
      testContactUUID
    ).then(responseData => {
      // console.log('RRRRRR', responseData);
      assert(typeof(responseData) === "undefined");
      done();
    });
  });
  it("List All Contacts", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.login(
      creds.CPAAS_KEY,
      creds.email,
      creds.password
    ).then(identityData => {
      // console.log(identityData);
      s2sMS.Contacts.listContacts(
        creds.CPAAS_KEY,
        identityData.user_uuid
      ).then(responseData => {
        // console.log('contact list', responseData.length);
        assert(responseData.length > 0);
        done();
      });
    });
  });

});
