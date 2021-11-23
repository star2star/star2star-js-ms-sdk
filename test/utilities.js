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
        "body": "some error string"
      },
      "statusCode": 400
    });
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

  it("test decrypt appcpher", function (done) {
    const decString = Util.decrypt("d7e8495e-b1a2-49c4-83a7-6e2b2eeb996f", "af1784e109f5656f46b1c126fc294b7268b609542b4dfe7a673a27edcf311c4504112e42797008cd4f51606143d7568b86a850b7533295ba2f9261da4907e6f91679a69408171ec1d3e359dfe8be61e934a26611e096e179d054795262baa88ba4375b5eaf67ee54983a81ba5e7d412faf33e83ce233c2eb063b32b872d3db11ad4ef76edfe1b1bcef3279a8e78e8672d829b55825674913a75edd8fd7588212b6bc583f7d5e38b31b5ebf14af48a705733801745040a6aec940d06c5a334d3dda1050bab722fa374ad5bebf44c8eb6a9cf94dd178f6d3c2e2189ed8649bc26956a50d540ec4efaf7d17b551cd9c09bb58e60816b0471089983de4c676119108d27277bb33007575d5298d7188c50f99522f834b10847c0f3451f69776e2cff7e23e6dfbb6c2ae6c8c6386ec129b70481af16a166187ff99af9caa69bfa8468c0c0b5c6723526adc98a3341c3850005eeb2152dc621285b2a920b2059206d494b2477503112506d9cc1f503c87834c12798733f1d9e3fa1889a81d5c48a0038e08cdaa9f777bf301c17cc6d79dc68820941552f02883c9d7b6265b1ec68bda48a1969fc8226afe953555f7fac9ed0cafbb5b4f4be024da1840f782f71ffe27b0009e8e069038a441460a014b6f9a88719829b85545f2667f00a467b10552ff9a52146589da1fc6d28648b0bf99e6c7a67a52ab652e313b512a8e77013b4efd402c4819190fc6d5af56dadd5dbdab440cd29b2596e3171e9497f9095f1c680d74d1a774c4ccb2949365c7b11482abf1863c7f476d76c9131e15986235d61fe444dbd4c617fc0e84f12ad2b25209517495f53e11ba45320f5f400095859eb75a9bb25eb1a3ff61d501728bd80d7f5e9b5b66ee8b132cfa8e59d4c66a24dc51329cf5cf3144bd6aa269e1d12b410672e8b79e3e819339e28630b0f980eb9197b572ea4edc5fe805be0c36c15a6f764adced");
    console.log("APP",JSON.parse(decString, null, "  "));
    assert.equal(1,1);
    done();
  });

  it("test decrypt flow", function (done) {
    const decString = Util.decrypt("d7e8495e-b1a2-49c4-83a7-6e2b2eeb996f", "af1784e109f5656f46b1c126fc294b7268b609542b4dfe7a673a27edcf311c4504112e42797008cd4f51606143d7568b86a850b7533295ba2f9261da4907e6f91679a69408171ec1d3e359dfe8be61e934a26611e096e179d054795262baa88b6d0408031e6d6e62bd1b41d274fd9e3cdafa47f70194e54f496d550ecd96aa067348ade2aa2c8fe4cb9068d75478e1923cfb22c9ff974e9b5ba9db2fd3f22a056aa80d6067522f0cae544a08eb7edbd6321e7eb94d35111c47c5509779ac589dfff74d8ca0188afbbc8c60536a0ab5705d4511f269e19bf9eb4c805439640f16950c01e63f01dd63ea57c317ef9a0e1fe7d9a3c7902440e112e9e5cb8efb56816b45bd4a3672c252d533edd84cb265fa78cd263c8f16199732499f00ed1ea90223ee67927d84922120891203ca819a65ad3554d1a405298b73bd403291560f84f5036aa4c07c350d5267d3ec3c804b6d33eeb92a798aad0478b55716c97faa87e79eebd1f10fcc6177742452c02adddbf899b513069e461efb6d113ab8cdca72867870e1ada5eaacb95d7fe54f50cc087d4a746e51f803282b96b9e5c2e2074ce66039f9545b79d6e58a7b9129914bb93bd1efb33f0fd1fe197b32e15c828eb23b0d6333a4afeae666b590e960a46847ab1f44ec553bb7b494aad56de33a8b6872b757cdf80e2d8f7261651a9556e07869f602259281b86e692e5e48d0efbf731f9363df6c3ade7c6609cef5146353feed1df909b6c3450712c3bd043ab431b0af567f783ed63c24a3b1472b40b66b4ce544e44833b800fd3deca07c6eb649bc556bb1689e75e633e5b74ab397cb28714f87ac3b82b34a11b977dbb6c64ec18cb2b3ee91110f047b3487e12bfc612a67802421ae366d1122b10474eab0df46f6d0085d25b3eafadce0fbaea25fdbebdd8955681fd2c57cccc0d855d813bdac469d90fec9471af13715b2931595f731db");
    console.log("FLOW",JSON.parse(decString, null, "  "));
    assert.equal(1,1);
    done();
  });

});