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
let trace = Util.generateNewMetaData();
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



describe("Activity MS Unit Test Suite", function() {
  let accessToken,
    cTemplate,
    reportTemplate,
    report;

  before(async () => {
    try {
      
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
    } catch (error) {
      throw error;
    }
    
  });

  it("List Activities", mochaAsync(async () => {
    console.log('identityData', identityData);
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.listActivities(
      accessToken,
      {"activity_type": "voicemail", include: "metadata", "owner_uuid": identityData.uuid }, //filter
      0, // offset
      5000,  // limit
      trace
    );
    assert.ok(
      typeof response.items !== "undefined" &&
      Array.isArray(response.items) &&
      JSON.stringify(response, null, "\t")
    );
 
    // console.log(JSON.stringify(reportTemplate, null, 2))
    return response;
  },"List Activities"));

 
  it("List Reports", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.listReportTemplates(
      accessToken,
      0, // offset
      1100,  // limit
      trace
    );
    assert.ok(
      typeof response.items !== "undefined" &&
      Array.isArray(response.items) &&
      typeof response.items[0].template_uuid === "string",
      JSON.stringify(response, null, "\t")
    );
    reportTemplate = response.items.reduce((p,r)=>{
      if (!p) {
        // console.log(r);
        if (r.name === "Appt Conf Response"){
          return r;
        };
      }
      return p;
    }, undefined);
    // console.log(JSON.stringify(reportTemplate, null, 2))
    return response;
  },"List Reports"));

  it("Run Report", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.runReport(
      accessToken,
      reportTemplate.template_uuid, 
      undefined, //owner_uuid
      identityData.account_uuid, 
      {
        "start_time": (Date.now() - 2592000),
        "end_time": Date.now(),
        "name": "foo"
      }, //parameters
      trace
    );
    assert.ok(
      typeof response.template_uuid === "string" &&
      typeof response.report_uuid === "string",
      JSON.stringify(response, null, "\t")
    );
    report = response;
    return response;
  },"Run Report"));

  it("Get Report", mochaAsync(async () => {
    // allow report to finish
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.getReport(
      accessToken,
      report.report_uuid,
      report.template_uuid, 
      trace
    );
    // console.log('rrrrr', JSON.stringify(response, null, 2))
    assert.ok(
      1 === 1,
      JSON.stringify(response, null, "\t")
    );
    report = response;
    return response;
  },"Get Report"));

  it("list register types", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.listRegisteredTypes(
      accessToken,
      undefined,
      0,
      100,
      trace
    );
    assert.ok(
      response.metadata.total > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"list register types"));

  it("list register subtypes", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.listRegisteredSubTypes(
      accessToken, 
      undefined,
      0,
      100,
      trace
    );
    assert.ok(
      response.metadata.total > 0,
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"list register subtypes"));


  it("create activity report template", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const response = await s2sMS.Activity.createReportTemplate(
      accessToken, 
      "unit test name",
      "unit test description",
      "table",
      {"source_type": "activity",  "activity": "cwa_urgent_history",  "local_data": [{}]},
      [{"name": "created_ts", "type": "date"}],
      [{"name": "status"}],
      [[{"column": "created_ts", "op": ">=", "value": "$start_time"}]],
      {"primary_column":"created_ts", "primary_direction": "ascending"},
      undefined, // aggregates
      undefined, //visualizations
      trace
    );
    // console.log(JSON.stringify(response, null, 2));
    cTemplate = response;

    assert.ok(
      response.hasOwnProperty("template_uuid"),
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"create activity report template"));

  it("update activity report template", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);
    const uResponse = await s2sMS.Activity.updateReportTemplate(
      accessToken, 
      cTemplate.template_uuid,
      cTemplate, 
      trace
    );
 
    assert.ok(
      uResponse.hasOwnProperty("template_uuid"),
      JSON.stringify(uResponse, null, "\t")
    );
    return uResponse;
  },"update activity report template"));


  it("delete activity report template", mochaAsync(async () => {
    
    trace = Util.generateNewMetaData(trace);

    const dResponse = await s2sMS.Activity.deleteReportTemplate(
      accessToken, 
      cTemplate.template_uuid,
      trace
    );
      // console.log(JSON.stringify(dResponse, null, 2))
    assert.ok(
      dResponse === undefined,
      JSON.stringify(dResponse, null, "\t")
    );
    return dResponse;
  }," delete activity report template"));
 
});
