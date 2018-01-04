var assert = require('assert');
var s2sMS = require('../identity');
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

describe('Identity MS', function() {
  it('Get Identity with Good Credentials', function(done) {
    if (!creds.isValid) return done();
    s2sMS.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      assert(identityData !== null )
      done();
    })
  });
  it('Get Identity with Bad Credentials', function(done) {
    if (!creds.isValid) return done();
    s2sMS.getIdentity(creds.CPAAS_KEY, creds.email, 'bad').catch((identityData)=>{
      //console.log('---- %j', identityData)
      assert(identityData.statusCode === 401)
      done();
    })
  });
  it('Refresh Token', function(done) {
    if (!creds.isValid) return done();
    s2sMS.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      console.log('iiiii %j', identityData )
      s2sMS.refreshToken(creds.CPAAS_KEY, identityData.refresh_token).then((refreshData)=>{
        console.log('rrrrrr %j', refreshData )
        assert(refreshData !== null )
        done();
      })
    })
  });
});
