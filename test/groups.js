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

describe('Groups', function() {
  it('List Groups', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      //console.log(identityData)
      s2sMS.Groups.listGroups(creds.CPAAS_KEY, identityData.user_uuid, identityData.token).then((responseData)=>{
        //console.log(responseData)
        assert(responseData.metadata !== null )
        done();
      })
    })
  });

  it('Create /  Delete Group ', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      /*
      * @param name - String group Name
      * @param description - description
      * @param groupType = string group type
      * @param members - array of type, uuid,
      * @param accountUUID - account uuid optional
      */
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((responseData)=>{
          //console.log(identityData.token)
        //console.log(responseData)
        assert(responseData.metadata !== null )
        done();
        s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, responseData.uuid ).then((d)=>{
        });

      })
    })
  });

  it('Create, update and  Delete Task', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((responseData)=>{
           //console.log(responseData);
           responseData.name = 'james';

           s2sMS.Groups.updateGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
             responseData.uuid, responseData ).then((updatedData)=>{
               assert(updatedData.name === 'james')
               done();
               s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
                 updatedData.uuid).then((d)=>{
                   //console.log(d)
                 })
             })
      })
    })
  });
  it('Create, get and  Delete Task', function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((identityData)=>{
      s2sMS.Groups.createGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token, 'foo','desc', 'footype',[] ).then((responseData)=>{
           //console.log(responseData);
           s2sMS.Groups.getGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
             responseData.uuid ).then((updatedData)=>{
               assert(updatedData.uuid === responseData.uuid)
               done();
               s2sMS.Groups.deleteGroup(creds.CPAAS_KEY, identityData.user_uuid, identityData.token,
                 updatedData.uuid).then((d)=>{
                   //console.log(d)
                 })
             })
      })
    })
  });
});