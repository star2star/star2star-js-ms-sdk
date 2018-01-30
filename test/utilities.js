var assert = require('assert');
var util = require('../utilities');
var config = require('../config.json');
var fs = require('fs');


var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: 'email@email.com',
  password: 'pwd',
  isValid: false
}

beforeEach(function(){
  process.env.NODE_ENV = 'dev';
  // file system uses full path so will do it like this
  if (fs.existsSync('./test/credentials.json')) {
    // do not need test folder here
    creds = require('./credentials.json');
  }
});

describe('Util', function() {

  it('config', function(done){
    const cfg = util.config
    assert.deepEqual(config, cfg);
    done();
  });

  it('replace variables', function(done) {
    const newString = util.replaceVariables('%foo%', {'foo': 1});
    assert(newString === "1" )
    done();
  });

  it('replace variables missing', function(done) {
    const newString = util.replaceVariables('%foobar%', {'foo': 1});
    assert.equal(newString, '%foobar%' )
    done();
  });

  it('replace variables nested', function(done) {
    const newString = util.replaceVariables('%foobar%', {'foo': 1, 'bar':{'foobar': 'value'}});
    assert.equal(newString, 'value' )
    done();
  });
  it('replace static stuff ONLY ', function(done) {
    const newString = util.replaceVariables('%YYYY% %MM% %DD%', {});
    //console.log(newString)
    assert(newString.length === 10 )
    done();
  });


  it('replace variables multiple', function(done) {
    const x = "now is the %time.1% for all %attribute-1% now %DUDE% was %Date1% could also be %diet_food%  how about %a/b% but not %/james%";
    const mValue = 'now is the timeOne for all attributeOne now dude was dateOne could also be dietFood  how about aDividedb but not slashJames';
    const ot = {
      'time.1':'timeOne',
      '/james': 'slashJames',
      'a':{
        'diet_food': 'dietFood',
        'b':{
          'attribute-1': 'attributeOne',
          'a/b': 'aDividedb'
        }
      },
      'DUDE': 'dude',
      'Date1': 'dateOne'
    };

    const newString = util.replaceVariables(x, ot);
    assert.equal(newString, mValue )
    done();
  });

  it('replace variables multiple one missing', function(done) {
    const x = "now is the %time.1% for %missing% all %attribute-1% now %DUDE% was %Date1% could also be %diet_food%  how about %a/b% but not %/james%";
    const mValue = 'now is the timeOne for %missing% all attributeOne now dude was dateOne could also be dietFood  how about aDividedb but not slashJames';
    const ot = {
      'time.1':'timeOne',
      '/james': 'slashJames',
      'a':{
        'diet_food': 'dietFood',
        'b':{
          'attribute-1': 'attributeOne',
          'a/b': 'aDividedb'
        }
      },
      'DUDE': 'dude',
      'Date1': 'dateOne'
    };

    const newString = util.replaceVariables(x, ot);
    assert.equal(newString, mValue )
    done();
  });

  it('test getEndpoint valid - dev', function(done){
    const prodEndPoint = util.getEndpoint("dev", 'IDENTITY');
    assert.equal("https://cpaas.star2star.net/identity", prodEndPoint);
    done();
  });

  it('test getEndpoint valid - test ', function(done){
    const prodEndPoint = util.getEndpoint("test", 'IDENTITY');
    assert.equal("https://cpaas.star2star.net/identity", prodEndPoint);
    done();
  });

  it('test getEndpoint valid - prod ', function(done){
    const prodEndPoint = util.getEndpoint('prod', 'IDENTITY');
    assert.equal("https://cpaas.star2star.com/api/identity", prodEndPoint);
    done();
  });

  it('test getEndpoint invalid env ', function(done){
    const prodEndPoint = util.getEndpoint('foobar', 'IDENTITY');
    assert.equal("https://cpaas.star2star.com/api/identity", prodEndPoint);
    done();
  });

  it('test getEndpoint invalid service ', function(done){
    const prodEndPoint = util.getEndpoint('prod', 'foo');
    assert.equal(undefined, prodEndPoint);
    done();
  });

  it('test getEndpoint valid - lowercase ', function(done){
    const prodEndPoint = util.getEndpoint(undefined, 'identity');
    assert.equal("https://cpaas.star2star.com/api/identity", prodEndPoint);
    done();
  });

  it('test create UUID  ', function(done){
    const uuid = util.createUUID( );
    assert.equal(uuid.length, 36);
    done();
  });
});
