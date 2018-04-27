const assert = require("assert");
const s2sMS = require("../index");
const fs = require("fs");

let creds = {
  CPAAS_KEY: "yourkeyhere",
  CPAAS_IDENTITY_KEY: "id key here",
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};


var getPromiseArrayForUserLoginAndAccessToken = () => {
  let promiseArray = [];

  // get access token
  promiseArray.push(s2sMS.Oauth.getAccessToken(
    creds.CPAAS_OAUTH_KEY,
    creds.CPAAS_OAUTH_TOKEN,
    creds.CPAAS_API_VERSION,
    creds.email,
    creds.password
  ));

  promiseArray.push(s2sMS.Identity.login(
    creds.CPAAS_IDENTITY_KEY,
    creds.email,
    creds.password
  ));

  return promiseArray;
};

describe("Objects MS Test Suite", function () {

  let accessToken;
  let user_uuid;

  before(function () {
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }
    // get accessToken and user_uuid to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return Promise.all(getPromiseArrayForUserLoginAndAccessToken())
      .then(promiseData => {
        const oauthData = promiseData[0];
        const identityData = promiseData[1];

        const oData = JSON.parse(oauthData);
        // console.log('Got access token and identity data -[Get Object By Data Type] ', identityData, oData);
        accessToken = oData.access_token;
        user_uuid = identityData.user_uuid;
      });
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
        // console.log('DELETED', d)
      });
    });
  });

  it("Create and Get User Object", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Objects.createUserDataObject(
      user_uuid,
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
      ).then(retrievedData => {
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
        });
      });
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
      user_uuid,
      accessToken,
      objName,
      objType,
      objDescription,
      objContent
    ).then((objData) => {
      // console.log('New Data Object response', objData);
      // get object that was just created
      s2sMS.Objects.getDataObjectByType(
          user_uuid,
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
          // delete the data object(s)
          responseData.items.forEach((item) => {
            s2sMS.Objects.deleteDataObject(
              accessToken,
              item.uuid
            );
          });
          done();
        })
        .catch((e) => {
          console.error('Error getting object by type', e);
        });
    }).catch((e) => {
      console.log('error creating data object [Get Object By Data Type]', e)
    });
  });

  it("UpdateUserObject", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Objects.createUserDataObject(
      user_uuid,
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
      ).then(upObj => {
        // console.log('User Object Update response', upObj);
        assert(upObj.content.hasOwnProperty("myContent"));
        done();
        s2sMS.Objects.deleteDataObject(
          accessToken,
          upObj.uuid
        ).then(d => {
          //console.log(d)
        });
      });
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
          user_uuid,
          accessToken,
          name,
          objType,
          objDescription,
          objContent
        )
      );
    });

    Promise.all(objectPromisArray)
      .then((objectData) => {
        const obj1 = objectData[0];
        const obj2 = objectData[1];

        s2sMS.Objects.getDataObjectByTypeAndName(
            user_uuid,
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
          .catch(x => {
            console.error(x);
          });

        // TODO delete the objects
        objectData.forEach((obj) => {
          s2sMS.Objects.deleteDataObject(
            accessToken,
            obj.uuid
          ).then((d) => {
            // console.log('d', d);
          }).catch((e) => {
            console.log('Error deleting objects [getDataObjectsByTypeAndName]', e);
          })
        });
      });
  });

});