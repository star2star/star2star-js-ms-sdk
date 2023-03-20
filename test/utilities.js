//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const beforeEach = mocha.beforeEach;

//test requires
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
var config = require("../src/config");

beforeEach(function () {
  s2sMS.setMsHost(process.env.MS_HOST);
  s2sMS.setMsAuthHost(process.env.AUTH_HOST);
});

describe("Util", function () {
  it("config", function (done) {
    const cfg = Util.config;
    assert.deepEqual(config, cfg);
    done();
  });

  it("replace variables", function (done) {
    const newString = Util.replaceVariables("%foo%", {
      foo: 1
    });
    assert(newString === "1");
    done();
  });

  it("replace variables missing", function (done) {
    const newString = Util.replaceVariables("%foobar%", {
      foo: 1
    });
    assert.equal(newString, "%foobar%");
    done();
  });

  it("replace variables nested", function (done) {
    const newString = Util.replaceVariables("%foobar%", {
      foo: 1,
      bar: {
        foobar: "value"
      }
    });
    assert.equal(newString, "value");
    done();
  });
  it("replace static stuff ONLY ", function (done) {
    const newString = Util.replaceVariables("%YYYY% %MM% %DD%", {});
    //console.log(newString)
    assert(newString.length === 10);
    done();
  });
  it("replace static stuff concat ", function (done) {
    const newString = Util.replaceVariables("APPT_%YYYY%%MM%%DD%", {});
    //console.log(newString.length)
    assert(newString.length === 13);
    done();
  });

  it("replace variables multiple", function (done) {
    const x =
      "now is the %time.1% for all %attribute-1% now %DUDE% was %Date1% could also be %diet_food%  how about %a/b% but not %/james%";
    const mValue =
      "now is the timeOne for all attributeOne now dude was dateOne could also be dietFood  how about aDividedb but not slashJames";
    const ot = {
      "time.1": "timeOne",
      "/james": "slashJames",
      a: {
        diet_food: "dietFood",
        b: {
          "attribute-1": "attributeOne",
          "a/b": "aDividedb"
        }
      },
      DUDE: "dude",
      Date1: "dateOne"
    };

    const newString = Util.replaceVariables(x, ot);
    assert.equal(newString, mValue);
    done();
  });

  it("replace variables multiple one missing", function (done) {
    const x =
      "now is the %time.1% for %missing% all %attribute-1% now %DUDE% was %Date1% could also be %diet_food%  how about %a/b% but not %/james%";
    const mValue =
      "now is the timeOne for %missing% all attributeOne now dude was dateOne could also be dietFood  how about aDividedb but not slashJames";
    const ot = {
      "time.1": "timeOne",
      "/james": "slashJames",
      a: {
        diet_food: "dietFood",
        b: {
          "attribute-1": "attributeOne",
          "a/b": "aDividedb"
        }
      },
      DUDE: "dude",
      Date1: "dateOne"
    };

    const newString = Util.replaceVariables(x, ot);
    assert.equal(newString, mValue);
    done();
  });

  it("test getEndpoint valid", function (done) {
    const prodEndPoint = Util.getEndpoint("IDENTITY");
    assert.equal(`${process.env.MS_HOST}/identity`, prodEndPoint);
    done();
  });

  // it('test getEndpoint valid - dev', function(done){
  //   const prodEndPoint = Util.getEndpoint("dev", 'IDENTITY');
  //   assert.equal("https://cpaas.star2star.net/identity", prodEndPoint);
  //   done();
  // });
  //
  // it('test getEndpoint valid - test ', function(done){
  //   const prodEndPoint = Util.getEndpoint("test", 'IDENTITY');
  //   assert.equal("https://cpaas.star2star.net/identity", prodEndPoint);
  //   done();
  // });
  //
  // it('test getEndpoint valid - prod ', function(done){
  //   const prodEndPoint = Util.getEndpoint('prod', 'IDENTITY');
  //   assert.equal("https://cpaas.star2star.com/api/identity", prodEndPoint);
  //   done();
  // });
  //
  // it('test getEndpoint invalid env ', function(done){
  //   const prodEndPoint = Util.getEndpoint('foobar', 'IDENTITY');
  //   assert.equal("https://cpaas.star2star.com/api/identity", prodEndPoint);
  //   done();
  // });

  it("test getEndpoint invalid service ", function (done) {
    const prodEndPoint = Util.getEndpoint("foo");
    assert.equal(undefined, prodEndPoint);
    done();
  });

  it("test getEndpoint valid - lowercase ", function (done) {
    const prodEndPoint = Util.getEndpoint("identity");
    assert.equal(`${process.env.MS_HOST}/identity`, prodEndPoint);
    done();
  });

  it("test getAuthHost valid - lowercase ", function (done) {
    const prodAuthHost = Util.getAuthHost();
    assert.equal(process.env.AUTH_HOST, prodAuthHost);
    done();
  });

  it("test create UUID  ", function (done) {
    const uuid = Util.createUUID();
    assert.equal(uuid.length, 36);
    done();
  });

  it("test errorParser when body is string", function (done) {
    const parsedError = Util.formatError({
      "name": "StatusCodeError",
      "response": {
        "body":   'some error string'
      },
      "statusCode": 400
    });
    // console.log('ppppp', JSON.stringify(parsedError, null, 2))
    assert(parsedError.message === "some error string");
    done();
  });

  it("test encrypt", function (done) {
    const encString = Util.encrypt("123456", "This is a sample text");
    assert.equal(encString, "052485834a702c703a8a6f96ac4b0e313c0b3f91c7bc86a37d452fd4fff8095a");
    done();
  });

  it("test decrypt", function (done) {
    const decString = Util.decrypt("123456", "052485834a702c703a8a6f96ac4b0e313c0b3f91c7bc86a37d452fd4fff8095a");
    assert.equal(decString, "This is a sample text");
    done();
  });

});