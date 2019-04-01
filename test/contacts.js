//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = Util.getLogger();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();


const testContact = {
  name: {
    first: "Test",
    last: "User"
  },
  phone_numbers: [
    {
      number: "9419998765",
      preferred: true,
      type: "Home"
    }
  ]
};

const testContact2 = {
  name: {
    first: "Other",
    last: "Name"
  },
  phone_numbers: [
    {
      number: "5555555555",
      preferred: true,
      type: "Fax"
    }
  ]
};

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func(name);
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Contacts MS Test Suite", function() {
  let accessToken,
    identityData,
    contactUUID,
    contact2UUID;

  before(async () => {
    try {
      // file system uses full path so will do it like this
      if (fs.existsSync("./test/credentials.json")) {
        // do not need test folder here
        creds = require("./credentials.json");
      }

      // For tests, use the dev msHost
      s2sMS.setMsHost(creds.MS_HOST);
      s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(creds.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
      const oauthData = await s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error){
      return Promise.reject(error);
    }
  });

  // template
  // it("change me", mochaAsync(async () => {
  //   if (!creds.isValid) throw new Error("Invalid Credentials");
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));

  it("Create User Contact", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Contacts.createUserContact(
      accessToken,
      identityData.uuid,
      testContact
    );
    contactUUID = response.uuid;
    assert.ok(
      response.hasOwnProperty("name") && 
      response.name.hasOwnProperty("first") &&
      response.name.first === "Test",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create User Contact"));

  it("Export User Contacts", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Contacts.exportContacts(
      accessToken,
      identityData.uuid
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      response.items[0].hasOwnProperty("uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Export User Contact"));

  it("List Contacts", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const newContact = await s2sMS.Contacts.createUserContact(
      accessToken,
      identityData.uuid,
      testContact2
    );
    contact2UUID = newContact.uuid;
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Contacts.listContacts(
      accessToken,
      identityData.uuid,
      0, //offset
      100, //limit
      {"number": "9"}, //filters...waiting on CSRVS-249 to test these
      trace
    );

    const response2 = await s2sMS.Contacts.listContacts(
      accessToken,
      identityData.uuid,
      0, //offset
      100, //limit
      {"name": "oth"}, //filters...waiting on CSRVS-249 to test these
      trace
    );
    logger.debug("List Contacts", response2);
    // may need to array.filter response if test identity has contacts that filter returns in addtion to test contacts
    assert.ok(
      response.items[0].uuid === contactUUID &&
      response2.items[0].uuid === contact2UUID,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Contacts"));

  it("Delete User Contact", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Contacts.deleteContact(
      accessToken,
      contactUUID
    );
    await s2sMS.Contacts.deleteContact(
      accessToken,
      contact2UUID
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete User Contact"));
  
});
