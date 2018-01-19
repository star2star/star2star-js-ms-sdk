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

describe('Objects MS', function() {
  it('All Notify DO With Good Credentials', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Objects.getDataObjectByType(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
        'all_notify_data_object', false).then((responseData)=>{
          //console.log(identityData.token)
          //console.log(responseData)
        assert(responseData.content !== null )
        done();
      }).catch((x)=>{
        console.error(x)
      })
    })
  });
  it('create Object', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Objects.createDataObject(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
        'myName', 'foo_bar', {"a":1}).then((responseData)=>{
          //console.log(identityData.token)
          //console.log(responseData)
        assert(responseData.content !== null )
        done();
        s2sMS.Objects.deleteDataObject(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
          responseData.uuid).then((d)=>{
            //console.log(d)
          })
      })
    })
  });
  it('update Object', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Objects.createDataObject(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
        'myName', 'foo_bar', {"a":1}).then((responseData)=>{
          //console.log(responseData);
          responseData.content.a = 2;
          s2sMS.Objects.updateDataObject(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
            responseData.uuid, responseData).then((upObj)=>{
              //console.log(upObj);
              assert(upObj.content.a === 2 )
              done();
              s2sMS.Objects.deleteDataObject(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
                upObj.uuid).then((d)=>{
                  //console.log(d)
                })
            })


      })
    })
  });
  it('getDataObjectByTypeAndName', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Objects.getDataObjectByTypeAndName(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
        'launchpad_list', 'Subscribers', true).then((responseData)=>{
          //console.log(identityData.token)
          //console.log(responseData)
        assert(responseData.content !== null )
        done();
      }).catch((x)=>{
        console.error(x)
      })
    })
  });
});
