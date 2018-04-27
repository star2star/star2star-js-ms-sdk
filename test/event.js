var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");

var creds = {
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


describe("Event Test Suite", function () {
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

  it("Create, update and  Delete Event", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Event.createEvent(
      user_uuid,
      accessToken,
      "event title",
      "event description", {
        a: 1,
        b: 2
      }
    ).then(responseData => {
      // console.log('createEvent response %j', responseData);
      responseData.name = "james";
      s2sMS.Event.updateEvent(
        accessToken,
        responseData.uuid,
        responseData
      ).then(updatedData => {
        // console.log(' updateEvent response %j', updatedData)
        assert(updatedData.name === "james");
        done();
        s2sMS.Event.deleteEvent(
          accessToken,
          updatedData.uuid
        ).then(d => {
          //console.log(d)
        });
      });
    }).catch((e) => {
      console.log('Failed createEvent', e);
    });
  });

  it("listEvents", function (done) {
    if (!creds.isValid) return done();

    // create some event objects for test
    const eventNames = ['Event1', 'Event2', 'Event3'];

    const eventPromiseArray = [];
    eventNames.forEach((name) => {
      eventPromiseArray.push(s2sMS.Event.createEvent(
        user_uuid,
        accessToken,
        name,
        name + " description ", {
          a: 1,
          b: 2
        }
      ));
    });

    Promise.all(eventPromiseArray).then((eventDataArray) => {
        // console.log('Created events [listEvents]', eventDataArray);
        s2sMS.Event.listEvents(
          user_uuid,
          accessToken
        ).then(responseData => {
          // console.log('listEvents response [listEvents]', responseData);

          // TODO what is valid test (assert) for this??? If no events, we get 
          // empty items array...  Should we create event objects ??? 
          assert(
            responseData.hasOwnProperty('items') &&
            checkCreatedEventsInList(responseData.items)
          );
          done();
        });
        //delete events generated for test
        eventDataArray.forEach((event) => {
          s2sMS.Event.deleteEvent(
            accessToken,
            event.uuid
          ).then(d => {
            //console.log(d)
          });

        });
        // local test helper function
        const checkCreatedEventsInList = (eventList) => {
          // return true if all test created events are in list
          const foundEventArray = eventList.filter((event) => {
            return event.uuid === eventDataArray[0].uuid ||
              event.uuid === eventDataArray[1].uuid ||
              event.uuid === eventDataArray[2].uuid;
          });
          // console.log('foundEventArray length', foundEventArray.length);
          return foundEventArray.length === eventDataArray.length;
        };
      })
      .catch((e) => {
        console.log('Failed creating events [listEvents]', e);
      });
  });

  it("Create and Get / Delete ", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Event.createEvent(
      user_uuid,
      accessToken,
      "event title - create and get/delete",
      "event description - create and get/delete", {
        a: 1,
        b: 2
      }
    ).then(responseData => {
      // console.log('Create event object %j', responseData);
      s2sMS.Event.getEvent(
        accessToken,
        responseData.uuid
      ).then(getData => {
        // console.log('Get event object', getData);
        assert(getData.uuid === responseData.uuid);
        done();
        s2sMS.Event.deleteEvent(
          accessToken,
          responseData.uuid
        ).then(d => {
          //console.log(d)
        });
      });
    });
  });
});