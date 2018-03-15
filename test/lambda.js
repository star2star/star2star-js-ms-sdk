var assert = require('assert');
var s2sMS = require('../lambda');
var config = require('../utilities').config;
var fs = require('fs');

var creds = {
  CPAAS_KEY: "yourkeyhere",
  email: 'email@email.com',
  password: 'pwd',
  isValid: false
}

beforeEach(function(){
  process.env.NODE_ENV = 'dev';
  process.baseUrl = 'https://cpaas.star2star.net';
  // file system uses full path so will do it like this
  if (fs.existsSync('./test/credentials.json')) {
    // do not need test folder here
    creds = require('./credentials.json');
  }
});

describe('Lambda MS', function() {

    it('invoke good lambda', function(done) {
      if (!creds.isValid) return done();
      const params = {'a':1};
      params.env = process.env.NODE_ENV;
      s2sMS.invokeLambda(creds.CPAAS_KEY,  "abc", params).then((lambdaResponse)=>{
        //console.log(lambdaResponse)
        const validResponse = { message: 'abc successfully finished', parameters: params };
        assert.deepEqual(lambdaResponse, validResponse)
        done();
      })
    });

    it('invoke default-all-notify lambda', function(done) {
      if (!creds.isValid) return done();
      const params = {
        "params":{"title":"911: ","body":"Called from zone: SRQ Main extension: Room 2701 at Thu Nov 16 2017 16:10:19 GMT+0000 (UTC) "},
        "cfg":{"_outDataSamples":["5a0db856818133001743490d"],"_selectedDataSamples":[],"_account":"59fcdca30f014f001733fda1","CPAAS_KEY":"588a5e9bf5612d00d8eb7df1e29a4b390b1448a66324533c29dce7ec","email":"jschimmoeller@schimmoeller.net","password":"2017star"},
        "config":config,
        "subscribers":[{"uuid":"1","name":"James","modality":"sms","value":"+19418076677"}],
        "env":  "dev"
    };

      s2sMS.invokeLambda(creds.CPAAS_KEY,  "default-all-notify", params).then((lambdaResponse)=>{
        //console.log('=======', lambdaResponse)
        const validResponse = 'sms successfully finished';
        assert.deepEqual(lambdaResponse.message, validResponse)
        done();
      }).catch((e)=>{
        console.log('-----', e);
        assert(false);
        done();
      })
    });

    it('invoke bad lambda', function(done) {
      if (!creds.isValid) return done();
      s2sMS.invokeLambda(creds.CPAAS_KEY,  "this one does not exists", {"env": "dev"}).catch((lambdaResponse)=>{
        //console.log(lambdaResponse)
        assert.equal(lambdaResponse.statusCode, 404)
        done();
      })
    });

});
