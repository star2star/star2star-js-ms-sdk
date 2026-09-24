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
  s2sMS.setMsHost(
    process.env.MS_HOST ||
      process.env.CPAAS_URL ||
      "https://cpaas-api.star2star.com"
  );
  s2sMS.setMsAuthHost(
    process.env.AUTH_HOST || "https://auth.star2star.com"
  );
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
    assert.equal(`${s2sMS.getMsHost()}/identity`, prodEndPoint);
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
    assert.equal(`${s2sMS.getMsHost()}/identity`, prodEndPoint);
    done();
  });

  it("test getAuthHost valid - lowercase ", function (done) {
    const prodAuthHost = Util.getAuthHost();
    assert.equal(
      prodAuthHost,
      process.env.AUTH_HOST || "https://auth.star2star.com"
    );
    done();
  });

  it("test isValidVersionString", function (done) {
    assert.equal(Util.isValidVersionString("1.2.3"), true);
    assert.equal(Util.isValidVersionString("not-a-version"), false);
    done();
  });

  it("test isVersionHigher", function (done) {
    assert.equal(Util.isVersionHigher("2.0.0", "1.9.9"), true);
    assert.equal(Util.isVersionHigher("1.0.0", "2.0.0"), false);
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
  
  let encryptedObj;
  const sampleObj = {
    name: "AccountAdmin",
    description: "AccountAdmin role",
    type: "role_permission",
    uuid: "bc631965-681f-4183-ba85-ec1a6ef85385",
  };
  it("test encrypt obj", function (done) {
    encryptedObj = Util.encryptObject("123456", sampleObj);
    assert.ok(encryptedObj.hasOwnProperty("iv") && encryptedObj.hasOwnProperty("ciphertext"));
    done();
  });

  it("test decryptObj", function (done) {
    const decObj = Util.decryptObject("123456", encryptedObj.ciphertext);
    assert.ok(sampleObj.name === decObj.obj.name && encryptedObj.iv === decObj.iv);
    done();
  });

  it("test decrypt", function (done) {
    const decString = Util.decrypt("123456", "052485834a702c703a8a6f96ac4b0e313c0b3f91c7bc86a37d452fd4fff8095a");
    assert.equal(decString, "This is a sample text");
    done();
  });

  it("addUrlQueryParams skips undefined values", function (done) {
    const uri = Util.addUrlQueryParams("https://example.test/path", {
      keep: "yes",
      skip: undefined,
    });
    assert.ok(uri.includes("keep=yes"));
    assert.ok(!uri.includes("skip"));
    done();
  });

  it("sanitizeObject removes sensitive sdk keys", function (done) {
    const sanitized = Util.sanitizeObject({
      _token: "secret",
      nested: { _basic_token: "abc", name: "visible" },
    });
    assert.strictEqual(sanitized._token, undefined);
    assert.strictEqual(sanitized.nested._basic_token, undefined);
    assert.strictEqual(sanitized.nested.name, "visible");
    done();
  });

  it("arrayDiff returns added and removed entries", function (done) {
    const diff = Util.arrayDiff(["a", "b"], ["b", "c"]);
    assert.deepStrictEqual(diff.added, ["c"]);
    assert.deepStrictEqual(diff.removed, ["a"]);
    done();
  });

  it("getUserUuidFromToken decodes jwt payload", function (done) {
    const payload = Buffer.from(JSON.stringify({ sub: "user-123" })).toString("base64");
    const token = `header.${payload}.signature`;
    assert.strictEqual(Util.getUserUuidFromToken(token), "user-123");
    done();
  });

  it("getAccountUuidFromToken decodes tid from jwt payload", function (done) {
    const payload = Buffer.from(JSON.stringify({ tid: "account-456" })).toString("base64");
    const token = `header.${payload}.signature`;
    assert.strictEqual(Util.getAccountUuidFromToken(token), "account-456");
    done();
  });

  it("paginate slices items with metadata", function (done) {
    const response = {
      items: [1, 2, 3, 4, 5],
      metadata: { total: 5 },
    };
    const page = Util.paginate(response, 1, 2);
    assert.deepStrictEqual(page.items, [2, 3]);
    assert.strictEqual(page.metadata.offset, 1);
    assert.strictEqual(page.metadata.limit, 2);
    done();
  });

  it("filterResponse matches filter keys on items", function (done) {
    const response = {
      items: [
        { suspended: 0, id: "a" },
        { suspended: 1, id: "b" },
      ],
    };
    const filtered = Util.filterResponse(response, { suspended: 0 });
    assert.strictEqual(filtered.items.length, 1);
    assert.strictEqual(filtered.items[0].id, "a");
    done();
  });

  it("extractProps copies only listed keys", function (done) {
    const picked = Util.extractProps({ a: 1, b: 2, c: 3 }, ["a", "c"]);
    assert.deepStrictEqual(picked, { a: 1, c: 3 });
    done();
  });

  it("findAndReplaceString replaces all occurrences", function (done) {
    const result = Util.findAndReplaceString("foo-bar-foo", "foo", "baz");
    assert.strictEqual(result, "baz-bar-baz");
    done();
  });

});