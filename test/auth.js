var assert = require('assert');
var s2sMS = require('../index');
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

describe('Auth MS', function() {
  it('list permissions', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.listUserPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token).then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length > 0 )
        done();
      })
    })
  });
  it('list permissions with resource type ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.listUserPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object").then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length > 0 )
        done();
      })
    })
  });
  it('list permissions with resource type with scope ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.listUserPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'global' ).then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length > 0 )
        done();
      })
    })
  });
  it('list permissions with resource type with scope and action ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.listUserPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'global', ['read']).then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length > 0 )
        done();
      })
    })
  });
  it('get Specific Permissions  ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.getSpecificPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'global', ['read']).then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length === 1 )
        done();
      })
    })
  });
  it('get Specific Permissions  multiple ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.getSpecificPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'global', ['read', 'list']).then((responseData)=>{
        //console.log('rrrrrr %j', responseData )
        assert(responseData.length === 2 )
        done();
      })
    })
  });
  it('get Specific Permissions invalid action', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.getSpecificPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'global', ['foo']).catch((errorData)=>{
        //console.log('rrrrrr %j', errorData )
        assert(errorData.indexOf('actions must be an array') > -1 )
        done();
      })
    })
  });
  it('get Specific Permissions invalid resouce_type', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.getSpecificPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "bad", 'global', ['foo']).catch((errorData)=>{
        //console.log('rrrrrr %j', errorData )
        assert(errorData.indexOf('resource_type must be') > -1 )
        done();
      })
    })
  });
  it('get Specific Permissions invalid scope', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log('iiiii %j', identityData )
      s2sMS.Auth.getSpecificPermissions(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, "object", 'x', ['foo']).catch((errorData)=>{
        //console.log('rrrrrr %j', errorData )
        assert(errorData.indexOf('scope must be') > -1 )
        done();
      })
    })
  });
});
