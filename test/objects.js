const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Objects MS Test Suite", function () {

  let accessToken, identityData;

  before(function () {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

     // For tests, use the dev msHost
     s2sMS.setMsHost("https://cpaas.star2starglobal.net");
     s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
     s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
     // get accessToken to use in test cases
     // Return promise so that test cases will not fire until it resolves.
     return new Promise((resolve, reject)=>{
       s2sMS.Oauth.getAccessToken(
         creds.CPAAS_OAUTH_TOKEN,
         creds.email,
         creds.password
       )
       .then(oauthData => {
         //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
         accessToken = oauthData.access_token;
         s2sMS.Identity.getMyIdentityData(accessToken).then((idData)=>{
           s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid).then((identityDetails)=>{
             identityData = identityDetails;
             resolve();
           }).catch((e1)=>{
             reject(e1);
           });
         }).catch((e)=>{
           reject(e);
         });
       });
     })
  });


  it("Create Global Object", function (done) {
    if (!creds.isValid) return done();

    // create a data object
    s2sMS.Objects.createDataObject(
      accessToken,
      "myName",
      "foo_bar",
      "the description", {
        a: 1
      }
    ).then(responseData => {
      // console.log('Create data object response', responseData);
      assert(responseData.content !== null);
      done();
      s2sMS.Objects.deleteDataObject(
          accessToken,
          responseData.uuid
        ).then(d => {
          // console.log('DELETED object ', responseData.uuid);
        })
        .catch((error) => {
          //console.log('Error deleing data object [createGlobalObject]', error);
        });
    })
    .catch((error) => {
      console.log('Error creating object [createGlobalObject]', error);
      done(new Error(error));
    });
  });

  it("Create and Get User Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Objects.createUserDataObject(
      identityData.uuid,
        accessToken,
        "myName",
        "foo_bar",
        "the description", {
          a: 1
        }
      ).then(responseData => {
        // console.log('create user data object response', responseData);
        s2sMS.Objects.getDataObject(
            accessToken,
            responseData.uuid
          )
          .then(retrievedData => {
            assert(
              retrievedData.content !== null &&
              retrievedData.content.hasOwnProperty('a')
            );
            done();
            s2sMS.Objects.deleteDataObject(
                accessToken,
                responseData.uuid
              ).then(d => {
                //console.log(d)
              })
              .catch((error) => {
                console.log('Error deleting user data object [create and get user object]', error);
              });
          })
          .catch((error) => {
            console.log('Error getting user data object [create and get user object]', error);
            done(new Error(error));
          });
      })
      .catch((error) => {
        console.log('Error creating User Object [create and get user object]', error);
        done(new Error(error));
      });
  });

  it("GetUserObjectByDataType", function (done) {
    if (!creds.isValid) return done();

    // create a new data object
    const objName = "Unit Test Object";
    const objType = "unit_test_object";
    const objDescription = "This object created as part of unit testing";
    const objContent = {
      test: "Test String"
    };
    s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      objName,
      objType,
      objDescription,
      objContent
    ).then((objData) => {
      // console.log('New Data Object response', objData);
      // get object that was just created
      s2sMS.Objects.getDataObjectByType(
          identityData.uuid,
          accessToken,
          "unit_test_object",
          false
        )
        .then(responseData => {
          // console.log('Got objects by type', responseData.items)
          assert(
            responseData.items.length > 0 &&
            responseData.items[0].type === "unit_test_object"
          );
          done();
          // delete the data object(s)
          responseData.items.forEach((item) => {
            s2sMS.Objects.deleteDataObject(
              accessToken,
              item.uuid
            ).then((d) => {
              // console.log('Deleting data object', item.uuid);
            }).catch((error) => {
              console.log('Error deleting user data object [GetUserObjectByDataType]', error);
            });
          });
        }).catch((error) => {
          console.error('Error getting object by type [GetUserObjectByDataType]', error);
          done(new Error(error));
        });
    }).catch((error) => {
      console.log('error creating user data object [[GetUserObjectByDataType]]', error);
      done(new Error(error));
    });
  });

  it("UpdateUserObject", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      "myName",
      "foo_bar",
      "the description", {
        a: 1
      }
    ).then(responseData => {
      // console.log('createUserDAtaObject respons [UpdateUserObject]', responseData);
      responseData.content = {
        myContent: "bluebirds are in the sky"
      };
      s2sMS.Objects.updateDataObject(
        accessToken,
        responseData.uuid,
        responseData
      ).then((upObj) => {
        //console.log('User Object Update response', upObj);
        assert(upObj.content.hasOwnProperty("myContent"));
        done();
        s2sMS.Objects.deleteDataObject(
          accessToken,
          upObj.uuid
        ).then((d) => {
          //console.log('Deleted object [UpdateUserObject]', upObj.uuid);
        }).catch((error) => {
          console.log('Error deleting data object [UpdateUserObject]', error);
        });
      }).catch((error) => {
        console.log('Error updating data object [UpdateUserObject]', error);
        done(new Error(error));
      });
    }).catch((error) => {
      console.log('Error creating data object [UpdateUserObject]', error);
      done(new Error(error));
    });
  });


  it("getUserDataObjectByTypeAndName", function (done) {
    if (!creds.isValid) return done();

    // create objects with different names but same type
    const objNames = ['test object 1', 'test object 2'];

    const objectPromisArray = [];

    const objType = 'unit_test_object_type';
    const objDescription = 'Unit Test Object for getting objects by type and name';
    const objContent = {
      "myContent": "Unit testing is cool!"
    };

    // Push createObject promises to array
    objNames.forEach((name) => {
      objectPromisArray.push(
        s2sMS.Objects.createUserDataObject(
          identityData.uuid,
          accessToken,
          name,
          objType,
          objDescription,
          objContent
        )
      );
    });

    Promise.all(objectPromisArray).then((objectData) => {
        const obj1 = objectData[0];
        const obj2 = objectData[1];

        s2sMS.Objects.getDataObjectByTypeAndName(
            identityData.uuid,
            accessToken,
            objType,
            objNames[1],
            true // loadContent
          )
          .then(responseData => {
            // console.log('GetObjectsByNameAndType response', responseData);
            assert(
              responseData.items.length > 0 &&
              responseData.items[0].name === objNames[1]
            );
            done();
          })
          .catch((error) => {
            console.log('Error getting data objects [getUserDataObjectByTypeAndName]', error);
            done(new Error(error));
          });

        objectData.forEach((obj) => {
          s2sMS.Objects.deleteDataObject(
            accessToken,
            obj.uuid
          ).then((d) => {
            // console.log('d', d);
          }).catch((error) => {
            console.log('Error deleting objects [getDataObjectsByTypeAndName]', error);
          })
        });
      }).catch((error) => { //
        console.log('Error creating data objects [getUserDataObjectByTypeAndName]', error);
        done(new Error(error));
      }); //promise all 
  });
});