//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = s2sMS.Util;
const logger = require("../src/node-logger").getInstance();
const objectMerge = require("object-merge");
let trace = Util.generateNewMetaData();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      return Promise.reject(error);
    }
  };
};



describe("Identity MS Unit Test Suite", function () {

  let accessToken, identityData, testUUID, testGroupUuid;

  before(async () => {
    try {
      
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.MS_HOST);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_HOST);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.CPAAS_OAUTH_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      return Promise.reject(error);
    }
  });

  it("Create Identity", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const body = {
      "account_uuid": identityData.account_uuid,
      "type": "user",
      "first_name": "Larry",
      "middle_name": "The",
      "last_name": "CableGuy",
      "username": "larry@fake.email",
      "status": "Active",
      "provider": "local",
      "email": "larry@fake.email",
      "phone": "5555555555",
      "address": {
        "city": "Somewhere",
        "state": "AK",
        "postal_code": "12345",
        "country": "US"
      }, 
      "reference": "Free form text"
    };
    const response = await s2sMS.Identity.createIdentity(
      accessToken,
      identityData.account_uuid,
      body,
      trace
    );
    testUUID = response.uuid;
    assert.ok(
      response.uuid !== undefined,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create Identity"));
  
  it("Create DID Identity Alias", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const body = {
      "nickname": "larry1@fake.email",
      "email": "larry@fake.email",
      "sms": "5555555556"
    };
    await s2sMS.Identity.createAlias(
      accessToken,
      testUUID,
      body,
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.getIdentityDetails(accessToken,testUUID, trace);
    assert.ok(
      response.aliases[0].sms === "5555555556",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Create DID Identity Alias"));

  it("Update DID Identity Alias", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Identity.updateAliasWithDID(
      accessToken,
      testUUID,
      "5555555557",
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.getIdentityDetails(accessToken,testUUID, trace);
    assert.ok(
      response.aliases[0].sms === "5555555557",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Update DID Identity Alias"));
 
  it("Modify Identity", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const body = {first_name: "Bob"};
    const response = await s2sMS.Identity.modifyIdentity(
      accessToken,
      testUUID,
      body,
      trace
    );
    assert.ok(
      response.first_name === "Bob",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Modify Identity"));
  
  it("Deactivate Identity", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.deactivateIdentity(accessToken, testUUID, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Deactivate Identity"));
  
  it("Reactivate Identity", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.reactivateIdentity(accessToken, testUUID, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Reactivate Identity"));
  
  it("Delete Identity and Confirm Identity is Removed from User-groups", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    //create group
    const body = {
      "account_id": identityData.account_uuid,
      "description": "A test group",
      "members": [
      ],
      "name": "Test",
      "type": "user"
    };
    const testGroup = await s2sMS.Groups.createGroup(
      accessToken,
      body,
      trace
    );
    testGroupUuid = testGroup.uuid;

    //add the test identity to the group
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const testMembers = [{
      type: "user",
      uuid: testUUID
    }];
    const addMember = await s2sMS.Groups.addMembersToGroup(
      accessToken,
      testGroupUuid,
      testMembers,
      trace
    );
    
    // delete the identity
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const deleteIdentity = await s2sMS.Identity.deleteIdentity(accessToken, testUUID, trace);
    const response = await s2sMS.Groups.listGroups(
      accessToken,
      0, //offset
      10, //limit
      {"member_uuid" : testUUID}, //filters
      trace
    );
    assert.ok(
      testGroup.name === "Test" &&
      addMember.name === "Test" &&
      addMember.total_members === 1 &&
      deleteIdentity.status === "ok" &&
      response.hasOwnProperty("items") &&
      response.items.length === 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Identity and Confirm Identity is Removed from User-groups"));
  
  it("Login with Good Credentials", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.login(
      accessToken,
      process.env.EMAIL,
      process.env.PASSWORD,
      trace
    );
    assert.ok(
      response !== null,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Login with Good Credentials"));

  it("Login with Bad Credentials", mochaAsync(async () => {
    try {
      
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const response = await s2sMS.Identity.login(accessToken, process.env.EMAIL, "bad", trace);
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch (error) {
      assert.ok(
        error.code === 401,
        JSON.stringify(error, null, "\t")
      );
      return error;
    } 
  },"Login with Bad Credentials"));

  it("Get My Identity Data", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.getMyIdentityData(accessToken, trace);
    assert.ok(
      response.hasOwnProperty("user_uuid") &&
      response.email === process.env.EMAIL,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get My Identity Data"));

  it("Get My Account's Identities", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    // const filters = {
    //   "username": identityData.email
    // };
    const response = await s2sMS.Identity.listIdentitiesByAccount(
      accessToken,
      identityData.account_uuid,
      0, //offset
      10, //limit
      {"username": identityData.email},
      trace
    );
    assert.ok(
      response.hasOwnProperty("items") &&
      Array.isArray(response.items) &&
      response.items[0].uuid === identityData.uuid,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get My Account's Identities"));
  
  it("Lookup Identity with known user", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const filters = [];
    filters["username"] = process.env.EMAIL;
    const response = await s2sMS.Identity.lookupIdentity(
      accessToken,
      0,
      10,
      {"username": process.env.EMAIL},
      trace
    );
    assert.ok(
      response.items.length === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Lookup Identity with known user"));

  it("Lookup Identity with unknown user", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.lookupIdentity(
      accessToken,
      1,
      10,
      {"username": "test333@test.com"},
      trace
    );
    assert.ok(
      response.items.length === 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Lookup Identity with unknown user"));
  
  it("Generate Password Token", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Identity.generatePasswordToken(
      accessToken,
      process.env.EMAIL,
      trace
    );
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Generate Password Token"));

  it("Reset Password", mochaAsync(async () => {
    try{
      
      trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
      const token = "aa38787e-e967-43de-b1ff-d907681dba59";
      const body = {
        email : process.env.EMAIL,
        password: process.env.PASSWORD
      };
      const response = await s2sMS.Identity.resetPassword(
        accessToken,
        token,
        body,
        trace
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.code === 404,
        JSON.stringify(error, null, "\t")
      );
      return error;
    }
  },"Reset Password"));

  it("Validate Password Token", mochaAsync(async () => {
    
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    // This token is expired, but we get a different response if the token was never valid or the call failed.
    const token = "aa38787e-e967-43de-b1ff-d907681dba59";
    const response = await s2sMS.Identity.validatePasswordToken(
      accessToken,
      token,
      trace
    );
    assert.ok(
      response.email === null,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Validate Password Token"));

  // template
  // it("change me", mochaAsync(async () => {
  //   
  //   trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});