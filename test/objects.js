const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");
const util = require("../src/utilities");
const logger = util.logger;

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Objects MS Test Suite", function() {
  let accessToken, identityData, userObjectUUID;

  before(function() {
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
    return new Promise((resolve, reject) => {
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      ).then(oauthData => {
        //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
        accessToken = oauthData.access_token;
        s2sMS.Identity.getMyIdentityData(accessToken)
          .then(idData => {
            s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid)
              .then(identityDetails => {
                identityData = identityDetails;
                resolve();
              })
              .catch(e1 => {
                reject(e1);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  });

  it("Create Shared User Object", function(done) {
    
    if (!creds.isValid) return done();
    s2sMS.Objects.createUserDataObject(
      identityData.uuid,
      accessToken,
      "Unit-Test", // name
      "unit-test", // type
      "the description", // description  
      {
        a: 1 //content
      }
      // identityData.account_uuid, // combined with users creates resource group scoping
      // {
      //   rud: [identityData.uuid],
      //   d: ["57852400-6650-466b-bdc2-bc128e6ccaca"] //users read, update, delete permissions
      // }
    )
      .then(responseData => {
        logger.info(
          `Create Shared User Object RESPONSE: ${JSON.stringify(
            responseData,
            null,
            "\t"
          )}`
        );
        userObjectUUID = responseData.uuid;
        done();
      })
      .catch(error => {
        logger.error(
          `Create Shared User Object ERROR: ${JSON.stringify(
            error,
            null,
            "\t"
          )}`
        );
        done(new Error(JSON.stringify(error)));
      });
  });

  it("Update User Object", function(done) {
    if (!creds.isValid) return done();
    setTimeout(() => {
      s2sMS.Objects.updateDataObject(
        accessToken,
        userObjectUUID,
        {
          "name": "Unit-Test",
          "type": "unit-test",
          "description" : "the modified description",
          "content_type": "application/json",
          "content": {a: 2}
        },
        identityData.account_uuid,
        {
          rd: [identityData.uuid],
          d: [identityData.uuid] //users read, update, delete permissions
        }
      )
        .then(responseData => {
          logger.info(
            `Update User Object RESPONSE: ${JSON.stringify(
              responseData,
              null,
              "\t"
            )}`
          );
          done();
        })
        .catch(error => {
          logger.error(
            `Update User Object ERROR: ${JSON.stringify(error, null, "\t")}`
          );
          done(new Error(error));
        });
    }, util.config.msDelay);
  });

  // it("Get Resource Group users", function(done) {
  //   if (!creds.isValid) return done();

  //   s2sMS.Auth.getResourceUsers(
  //     accessToken,
  //     userObjectUUID
  //   )
  //     .then(responseData => {
  //       logger.info(
  //         `Get Resource Group users RESPONSE: ${JSON.stringify(
  //           responseData,
  //           null,
  //           "\t"
  //         )}`
  //       );
  //       done();
  //     })
  //     .catch(error => {
  //       logger.error(
  //         `Get Resource Group users ERROR: ${JSON.stringify(error, null, "\t")}`
  //       );
  //       done(new Error(error));
  //     });
  // });

  it("Delete Shared User Object", function(done) {
    if (!creds.isValid) return done();
    if (userObjectUUID) {
      setTimeout(() => {
        s2sMS.Objects.deleteDataObject(accessToken, userObjectUUID)
          .then(responseData => {
            logger.info(
              `Delete Shared User Object RESPONSE: ${JSON.stringify(
                responseData,
                null,
                "\t"
              )}`
            );
            done();
          })
          .catch(error => {
            logger.error(
              `Delete Shared User Object ERROR: ${JSON.stringify(
                error,
                null,
                "\t"
              )}`
            );
            done(new Error(error));
          });
      }, util.config.msDelay); //takes a long time for resource groups to show up as associated with an object
    } else {
      done(new Error("userObjectUUID is undefined"));
    }
  });

  // it("Create Global Object", function(done) {
  //   if (!creds.isValid) return done();

  //   // create a data object
  //   s2sMS.Objects.createDataObject(
  //     accessToken,
  //     "myName",
  //     "objects-unit-test2",
  //     "the description",
  //     {
  //       a: 1
  //     }
  //   )
  //     .then(responseData => {
  //       // console.log('Create data object response', responseData);
  //       assert(responseData.content !== null);
  //       done();
  //       s2sMS.Objects.deleteDataObject(accessToken, responseData.uuid)
  //         .then(d => {
  //           // console.log('DELETED object ', responseData.uuid);
  //         })
  //         .catch(error => {
  //           console.log(
  //             "Error deleing data object [createGlobalObject]",
  //             error
  //           );
  //         });
  //     })
  //     .catch(error => {
  //       console.log("Error creating object [createGlobalObject]", error);
  //       done(new Error(error));
  //     });
  // });

  // it("Create and Get User Object", function(done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Objects.createUserDataObject(
  //     identityData.uuid,
  //     accessToken,
  //     "myName",
  //     "objects-unit-test2",
  //     "the description",
  //     {
  //       a: 1
  //     }
  //   )
  //     .then(responseData => {
  //       // console.log('create user data object response', responseData);
  //       s2sMS.Objects.getDataObject(accessToken, responseData.uuid)
  //         .then(retrievedData => {
  //           assert(
  //             retrievedData.content !== null &&
  //               retrievedData.content.hasOwnProperty("a")
  //           );
  //           done();
  //           s2sMS.Objects.deleteDataObject(accessToken, responseData.uuid)
  //             .then(d => {
  //               //console.log(d)
  //             })
  //             .catch(error => {
  //               console.log(
  //                 "Error deleting user data object [create and get user object]",
  //                 error
  //               );
  //             });
  //         })
  //         .catch(error => {
  //           console.log(
  //             "Error getting user data object [create and get user object]",
  //             error
  //           );
  //           done(new Error(error));
  //         });
  //     })
  //     .catch(error => {
  //       console.log(
  //         "Error creating User Object [create and get user object]",
  //         error
  //       );
  //       done(new Error(error));
  //     });
  // });

  // it("GetUserObjectByDataType", function(done) {
  //   if (!creds.isValid) return done();

  //   // create a new data object
  //   const objName = "Unit Test Object";
  //   const objType = "objects-unit-test2";
  //   const objDescription = "This object created as part of unit testing";
  //   const objContent = {
  //     test: "Test String"
  //   };
  //   s2sMS.Objects.createUserDataObject(
  //     identityData.uuid,
  //     accessToken,
  //     objName,
  //     objType,
  //     objDescription,
  //     objContent
  //   )
  //     .then(objData => {
  //       // console.log('New Data Object response', objData);
  //       // get object that was just created
  //       s2sMS.Objects.getDataObjectByType(
  //         identityData.uuid,
  //         accessToken,
  //         "objects-unit-test2",
  //         0, //offset
  //         10, //limit
  //         false
  //       )
  //         .then(responseData => {
  //           //console.log('Got objects by type', responseData);
  //           assert(
  //             responseData.items.length > 0 &&
  //               responseData.items[0].type === "objects-unit-test2"
  //           );
  //           done();
  //           // delete the data object(s)
  //           responseData.items.forEach(item => {
  //             s2sMS.Objects.deleteDataObject(accessToken, item.uuid)
  //               .then(d => {
  //                 // console.log('Deleting data object', item.uuid);
  //               })
  //               .catch(error => {
  //                 console.log(
  //                   "Error deleting user data object [GetUserObjectByDataType]",
  //                   error
  //                 );
  //               });
  //           });
  //         })
  //         .catch(error => {
  //           console.error(
  //             "Error getting object by type [GetUserObjectByDataType]",
  //             error
  //           );
  //           done(new Error(error));
  //         });
  //     })
  //     .catch(error => {
  //       console.log(
  //         "error creating user data object [[GetUserObjectByDataType]]",
  //         error
  //       );
  //       done(new Error(error));
  //     });
  // });

  // it("UpdateUserObject", function(done) {
  //   if (!creds.isValid) return done();
  //   s2sMS.Objects.createUserDataObject(
  //     identityData.uuid,
  //     accessToken,
  //     "myName",
  //     "objects-unit-test2",
  //     "the description",
  //     {
  //       a: 1
  //     }
  //   )
  //     .then(responseData => {
  //       // console.log('createUserDAtaObject respons [UpdateUserObject]', responseData);
  //       responseData.content = {
  //         myContent: "bluebirds are in the sky"
  //       };
  //       s2sMS.Objects.updateDataObject(
  //         accessToken,
  //         responseData.uuid,
  //         responseData
  //       )
  //         .then(upObj => {
  //           //console.log('User Object Update response', upObj);
  //           assert(upObj.content.hasOwnProperty("myContent"));
  //           done();
  //           s2sMS.Objects.deleteDataObject(accessToken, upObj.uuid)
  //             .then(d => {
  //               //console.log('Deleted object [UpdateUserObject]', upObj.uuid);
  //             })
  //             .catch(error => {
  //               console.log(
  //                 "Error deleting data object [UpdateUserObject]",
  //                 error
  //               );
  //             });
  //         })
  //         .catch(error => {
  //           console.log("Error updating data object [UpdateUserObject]", error);
  //           done(new Error(error));
  //         });
  //     })
  //     .catch(error => {
  //       console.log("Error creating data object [UpdateUserObject]", error);
  //       done(new Error(error));
  //     });
  // });

  // it("getUserDataObjectByTypeAndName", function(done) {
  //   if (!creds.isValid) return done();

  //   // create objects with different names but same type
  //   const objNames = ["test object 1", "test object 2"];

  //   const objectPromisArray = [];

  //   const objType = "objects-unit-test2";
  //   const objDescription =
  //     "Unit Test Object for getting objects by type and name";
  //   const objContent = {
  //     myContent: "Unit testing is cool!"
  //   };

  //   // Push createObject promises to array
  //   objNames.forEach(name => {
  //     objectPromisArray.push(
  //       s2sMS.Objects.createUserDataObject(
  //         identityData.uuid,
  //         accessToken,
  //         name,
  //         objType,
  //         objDescription,
  //         objContent
  //       )
  //     );
  //   });

  //   Promise.all(objectPromisArray)
  //     .then(objectData => {
  //       const obj1 = objectData[0];
  //       const obj2 = objectData[1];

  //       s2sMS.Objects.getDataObjectByTypeAndName(
  //         identityData.uuid,
  //         accessToken,
  //         objType,
  //         objNames[1],
  //         0, //offset
  //         10, //limit
  //         true // loadContent
  //       )
  //         .then(responseData => {
  //           console.log(
  //             "GetObjectsByNameAndType response",
  //             responseData.items[0].name
  //           );
  //           console.log("objNames[1]", objNames[1]);
  //           assert(
  //             responseData.items.length > 0 &&
  //               responseData.items[0].name === objNames[1]
  //           );
  //         })
  //         .catch(error => {
  //           console.log(
  //             "Error getting data objects [getUserDataObjectByTypeAndName]",
  //             error
  //           );
  //           done(new Error(error));
  //         });

  //       objectData.forEach(obj => {
  //         s2sMS.Objects.deleteDataObject(accessToken, obj.uuid)
  //           .then(d => {
  //             // console.log('d', d);
  //           })
  //           .catch(error => {
  //             console.log(
  //               "Error deleting objects [getDataObjectsByTypeAndName]",
  //               error
  //             );
  //           });
  //       });
  //       done();
  //     })
  //     .catch(error => {
  //       //
  //       console.log(
  //         "Error creating data objects [getUserDataObjectByTypeAndName]",
  //         error
  //       );
  //       done(new Error(error));
  //     }); //promise all
  // });

  // it("List Objects with SDK Aggregator and Paginator", function(done) {
  //   if (!creds.isValid) return done();

  //   const filters = {
  //     type: "starpaas_application",
  //     status: "inactive"
  //   };

  //   s2sMS.Objects.getDataObjects(
  //     accessToken,
  //     identityData.uuid,
  //     0, //offset
  //     25, //limit
  //     true, //load_content
  //     filters
  //   )
  //     .then(response => {
  //       //console.log("SDK List", response);
  //       assert(response.items.length > 0); //TODO expand this to test filtering, pagination, and aggregation
  //       done();
  //     })
  //     .catch(error => {
  //       console.log("SDK Error", error);
  //       done(new Error(error));
  //     });
  // });

});
