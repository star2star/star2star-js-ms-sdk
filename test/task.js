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
const Logger = require("../src/node-logger");
const logger = new Logger.default();
const objectMerge = require("object-merge");
const newMeta = Util.generateNewMetaData;
let trace = newMeta();

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

describe("Objects MS Test Suite", function() {
  let accessToken,
    identityData;

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

  it("Get Task Templates", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Task.getTaskTemplates(
      identityData.uuid,
      accessToken,
      trace
    );
    assert.ok(
      response.metadata !== null,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Get Task Templates"));
  
  it("Create / Delete Task Template", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const response = await s2sMS.Task.createTaskTemplate(
      identityData.uuid,
      accessToken,
      "foo", 
      "description of template", 
      [],
      trace
    );
    assert.ok(
      response.metadata !== null,
      JSON.stringify(response, null, "\t")
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Task.deleteTaskTemplate(
      accessToken,
      response.uuid,
      trace
    );
    return response;
  },"Create / Delete Task Template"));
 
  it("Create, update and  Delete Task", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const responseData = await s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "default desc",
      [{
        title: "hello"
      }],
      trace
    );
    responseData.name = "james";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const updatedData = await s2sMS.Task.updateTaskObject(
      accessToken,
      responseData.uuid,
      responseData,
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Task.deleteTaskObject(
      accessToken,
      updatedData.uuid,
      trace
    );
    assert.ok(
      updatedData.name === "james",
      JSON.stringify(updatedData, null, "\t")
    );
    return updatedData;
  },"Create, update and  Delete Task"));
  
  it("add task to task object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const responseData = await s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "default descripiont here", 
      [{
        title: "hello"
      }],
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const newData = await s2sMS.Task.addTaskToTaskObject(
      accessToken,
      responseData.uuid, {
        title: "lena"
      },
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Task.deleteTaskObject(
      accessToken,
      newData.uuid,
      trace
    );
    assert.ok(
      newData.content.tasks.length === 2,
      JSON.stringify(newData, null, "\t")
    );
    return newData;
  },"add task to task object"));
  
  it("udpate task to task object", mochaAsync(async () => {
    if (!creds.isValid) throw new Error("Invalid Credentials");
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const responseData = await s2sMS.Task.createTaskObject(
      identityData.uuid,
      accessToken,
      "title", 
      "dddddd", 
      [{
        title: "hello"
      }],
      trace
    );
    const z = responseData.content.tasks[0];
    z.title = "lena";
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    const newData = await s2sMS.Task.updateTaskInTaskObject(
      accessToken,
      responseData.uuid,
      z,
      trace
    );
    trace = objectMerge({}, trace, Util.generateNewMetaData(trace));
    await s2sMS.Task.deleteTaskObject(
      accessToken,
      newData.uuid,
      trace
    );
    assert.ok(
      newData.content.tasks.length === 1 &&
      newData.content.tasks[0].title === "lena",
      JSON.stringify(newData, null, "\t")
    );
    return newData;
  },"udpate task to task object"));
  
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
  
});