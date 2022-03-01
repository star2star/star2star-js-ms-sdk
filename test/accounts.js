//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = require("../src/node-logger").getInstance();
const newMeta = Util.generateNewMetaData;
let trace = newMeta();
let identityData;

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};



describe("Accounts MS Unit Test Suite", function() {
  let accessToken, accountUUID, contactUUID;
  let time = new Date()
    .getTime()
    .toString()
    .slice(-10); //FIXME Temporary until account number from deleted accounts can be reused.

  before(async () => {
    try {
      // console.log('ms host', process.env.BASIC_TOKEN);
      
      // For tests, use the dev msHost
      s2sMS.setMsHost(process.env.CPAAS_URL);
      s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
      s2sMS.setMsAuthHost(process.env.AUTH_URL);
      // get accessToken to use in test cases
      // Return promise so that test cases will not fire until it resolves.
    
      const oauthData = await s2sMS.Oauth.getAccessToken(
        process.env.BASIC_TOKEN,
        process.env.EMAIL,
        process.env.PASSWORD
      );
      accessToken = oauthData.access_token;
      const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
      identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
      // console.log('iii', JSON.stringify(identityData, null, 2 ));
      accountUUID = identityData.account_uuid;

    } catch (error) {
      throw error;
    }
    
  });

  it("Create Account Without Parent-uuid", mochaAsync(async () => {
    try {
      
      const body = {
        name: "Unit Test",
        number: time,
        type: "Reseller",
        description: "Free form text",
        address: {
          line1: "123 ABC St",
          line2: "Optional text",
          city: "Sarasota",
          state: "FL",
          postal_code: "12345",
          country: "US"
        },
        contacts: [
          {
            id: 1,
            type: "primary",
            first_name: "First",
            last_name: "Last",
            email: "abc@test.com",
            phone: "1112223333"
          }
        ],
        reference: "Free form text",
        status: "Active"
      };
      const response = await s2sMS.Accounts.createAccount(accessToken, body, trace);
      //This test is expected to fail, so use assert here since it should not get this far
      assert.ok(false, JSON.stringify(response, null, "\t"));
      return response;
    } catch (error) {
 
      assert.ok(
        error.hasOwnProperty("code") &&
        error.code === 400,
        JSON.stringify(error, null, "\t"));
      return error;
    }  
  },"Create Account Without Parent-uuid"));

  it("Create Account", mochaAsync(async () => {
    
    const body = {
      name: "Unit Test",
      number: ++time,
      type: "Location",
      description: "Free form text",
      address: {
        line1: "123 ABC St",
        line2: "Optional text",
        city: "Sarasota",
        state: "FL",
        postal_code: "12345",
        country: "US"
      },
      contacts: [
        {
          type: "primary",
          first_name: "First",
          last_name: "Last",
          email: "abc@test.com",
          phone: "1112223333"
        }
      ],
      reference: "Free form text",
      status: "Active",
      parent_uuid: identityData.account_uuid
    };
    trace = Util.generateNewMetaData(trace)
    try{
        const response = await s2sMS.Accounts.createAccount(accessToken, body, trace);
        //save the account number for other tests
        assert.ok(
          response.name === "Unit Test",
          JSON.stringify(response, null, "\t")
        );
        accountUUID = response.uuid;
        contactUUID = response.contacts[0].uuid;
        return response;
    } catch(e){
      console.log(e);
      return error;
    }
  },"Create Account"));

  it("Get Account Default User Groups", async () => {
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Auth.getAccountDefaultGroups(
      accessToken,
      accountUUID,
      trace
    );
    assert.ok(
      response.hasOwnProperty("admin") &&
      response.hasOwnProperty("user") &&
      response.admin.length > 0 &&
      response.user.length > 0,
      JSON.stringify(response, null, "\t")
    );
    logger.debug(this.ctx.test.title, response);
  });
  
  // Limit of 1 breaks call CSRVS-330
  // Super Admins this fails: CCORE-1414 opened 
  it("List Accounts", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts
      .listAccounts(
        accessToken, 
        0, //offset
        1, //limit
        {
          "type": "Customer", 
          "expand": "relationships"
        },
        trace
      );
    assert.ok(
      response.items.length === 1,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Accounts"));
  
 
  it("Get Account Data and Check Relationships", mochaAsync(async () => {
    
    //Workaround for CSRVS-181
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.getAccount(accessToken, accountUUID, trace);
    // console.log("rrrrrr", response);
    assert.ok(
      response.uuid === accountUUID &&
      response.relationships.items[0].source.uuid == accountUUID,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Account Data and Check Relationships"));
  
  it("Modify Account", mochaAsync(async () => {
    
    //Test Partial Update -- Address
    const rAccount = await s2sMS.Accounts.getAccount(accessToken, accountUUID, trace);
    rAccount.address.line2 = "james";

    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.modifyAccount(
      accessToken,
      accountUUID,
      rAccount,
      trace
    );
    assert.ok(
      response.address.line2 === rAccount.address.line2 ,
      JSON.stringify(response, null, "\t")
    );
 
    return response;
  },"Modify Account"));
  
  it("Get Account Data After Modify", mochaAsync(async () => {
    
    //Workaround for CSRVS-181
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.getAccount(accessToken, accountUUID, trace);
    assert.ok(
      response.uuid === accountUUID &&
      response.address.line2 === "james",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Account Data After Modify"));
  
  it("List Account Relationships", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.listAccountRelationships(
      accessToken,
      identityData.account_uuid,
      0, //offest
      10, //limit
      trace 
    );
    logger.debug("account uuid ***********", identityData.account_uuid);
    assert.ok(
      response.items.length > 0 &&
      response.items.filter(item => {
        if (item.target.type === "MasterReseller") {
          return item.target.uuid === identityData.account_uuid;
        }
      }),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"List Account Relationships"));
  
  it("Suspend Account", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.suspendAccount(accessToken, accountUUID, trace);
    // console.log('jjjj', JSON.stringify(response, null, 2));
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Suspend Account"));

  it("Reinstate Account", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.reinstateAccount(accessToken, accountUUID, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Reinstate Account"));

  it("Delete Account", mochaAsync(async () => {
    trace = Util.generateNewMetaData(trace)
    const response = await s2sMS.Accounts.deleteAccount(accessToken, accountUUID, trace);
    assert.ok(
      response.status === "ok",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Delete Account"));

  // template
  // it("change me", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace)
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
