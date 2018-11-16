/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Util = require("./utilities");
var Auth = require("./auth");
var Groups = require("./groups");
var env = Util.config.env;
var roles = Util.config.roles[env];
var msDelay = Util.config.msDelay;
var objectMerge = require("object-merge");
var logger = Util.logger;

/**
 * @async
 * @description This function will create the permissions group for a resource uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account to associate resource group to
 * @param {string} [resourceUUID="null resourceUUID"] - resource requiring permissions groups
 * @param {object} [users={}] - Read, Update, Delete users object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to an object containing a status message
 */
var createResourceGroups = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
    var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
    var resourceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null resourceUUID";
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "object";
    var users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var nextTrace, prop, userGroup, group;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            //create the groups
            nextTrace = objectMerge({}, trace);
            _context.t0 = regeneratorRuntime.keys(users);

          case 3:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 19;
              break;
            }

            prop = _context.t1.value;

            if (!roles[type].hasOwnProperty(prop)) {
              _context.next = 17;
              break;
            }

            userGroup = {
              name: prop + ": " + resourceUUID,
              users: [].concat(_toConsumableArray(users[prop])),
              description: "resource group"
            };

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context.next = 10;
            return Auth.createUserGroup(accessToken, accountUUID, userGroup, nextTrace);

          case 10:
            group = _context.sent;

            logger.info("Created resource group: " + JSON.stringify(group, null, "\t"));
            _context.next = 14;
            return new Promise(function (resolve) {
              return setTimeout(resolve, msDelay);
            });

          case 14:
            //microservices delay :(
            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context.next = 17;
            return Auth.assignScopedRoleToUserGroup(accessToken, group.uuid, roles[type][prop], "resource", [resourceUUID], nextTrace);

          case 17:
            _context.next = 3;
            break;

          case 19:
            return _context.abrupt("return", Promise.resolve({ status: "ok" }));

          case 22:
            _context.prev = 22;
            _context.t2 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject({ status: "failed", createResourceGroups: _context.t2 }));

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 22]]);
  }));

  return function createResourceGroups() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will remove any permissions groups associated with a resource.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - uuid of resource
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to a status message.
 */
var cleanUpResourceGroups = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null resourceUUID";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var resourceGroups, nextTrace, item;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return Auth.listAccessByGroups(accessToken, resourceUUID, trace);

          case 3:
            resourceGroups = _context2.sent;

            logger.info("Found resource groups to clean up: " + JSON.stringify(resourceGroups, null, "\t"));

            if (!(resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0)) {
              _context2.next = 15;
              break;
            }

            nextTrace = objectMerge({}, trace);
            _context2.t0 = regeneratorRuntime.keys(resourceGroups.items);

          case 8:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 15;
              break;
            }

            item = _context2.t1.value;

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            _context2.next = 13;
            return Groups.deleteGroup(accessToken, resourceGroups.items[item].user_group.uuid, nextTrace);

          case 13:
            _context2.next = 8;
            break;

          case 15:
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t2 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject(_context2.t2));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 17]]);
  }));

  return function cleanUpResourceGroups() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will update a resources permissions groups.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [data_uuid="uuid not specified"] - data object UUID
 * @param {object} [users={}}] - users object treated as PUT
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to confirmation of updated groups
 */
var updateResourceGroups = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
    var accountUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null accountUUID";
    var users = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var resourceGroups, nextTrace, groupTypeRegex, item, user;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return Auth.listAccessByGroups(accessToken, resourceUUID, trace);

          case 3:
            resourceGroups = _context4.sent;
            nextTrace = trace;

            logger.info("Resource group lookup success: " + JSON.stringify(resourceGroups, null, "\t"));

            if (!(resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0)) {
              _context4.next = 19;
              break;
            }

            //extract the type of group from the name
            groupTypeRegex = /^[r,u,d]{1,3}/;
            _context4.t0 = regeneratorRuntime.keys(resourceGroups.items);

          case 9:
            if ((_context4.t1 = _context4.t0()).done) {
              _context4.next = 19;
              break;
            }

            item = _context4.t1.value;

            logger.info("resource group item: " + JSON.stringify(resourceGroups.items[item], null, "\t"));

            if (!(resourceGroups.items[item].hasOwnProperty("user_group") && resourceGroups.items[item].user_group.hasOwnProperty("group_name"))) {
              _context4.next = 16;
              break;
            }

            return _context4.delegateYield( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              var groupType, userGroup, addUsers, deleteUsers;
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      groupType = groupTypeRegex.exec(resourceGroups.items[item].user_group.group_name);
                      // A resource group exists for this set of permissions.

                      if (!((typeof users === "undefined" ? "undefined" : _typeof(users)) === "object" && users.hasOwnProperty(groupType))) {
                        _context3.next = 20;
                        break;
                      }

                      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                      _context3.next = 5;
                      return Groups.getGroup(accessToken, resourceGroups.items[item].user_group.uuid, {
                        expand: "members",
                        members_limit: 999 //hopefully we don't need pagination here. nh
                      }, nextTrace);

                    case 5:
                      userGroup = _context3.sent;

                      logger.info("Found Existing Resource Group To Update: " + JSON.stringify(userGroup, null, "\t"));
                      //add the new users to the group
                      addUsers = users[groupType].filter(function (user) {
                        var found = false;
                        userGroup.members.items.forEach(function (groupUser) {
                          if (!found) {
                            user === groupUser.uuid ? found = true : found = false;
                          }
                        });
                        return !found;
                      }).map(function (user) {
                        return { uuid: user, type: "user" };
                      });

                      if (!(addUsers && addUsers.length > 0)) {
                        _context3.next = 12;
                        break;
                      }

                      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                      _context3.next = 12;
                      return Groups.addMembersToGroup(accessToken, userGroup.uuid, addUsers, nextTrace);

                    case 12:
                      //delete the old users from the group
                      deleteUsers = userGroup.members.items.filter(function (groupUser) {
                        var found = false;
                        users[groupType].forEach(function (user) {
                          if (!found) {
                            user === groupUser.uuid ? found = true : found = false;
                          }
                        });
                        return !found;
                      }).map(function (groupUser) {
                        return { uuid: groupUser.uuid };
                      });

                      if (!(deleteUsers && deleteUsers.length > 0)) {
                        _context3.next = 17;
                        break;
                      }

                      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                      _context3.next = 17;
                      return Groups.deleteGroupMembers(accessToken, userGroup.uuid, deleteUsers, nextTrace);

                    case 17:
                      //mark the users object as done for this groupType
                      users[groupType] = "";
                      _context3.next = 24;
                      break;

                    case 20:
                      _context3.next = 22;
                      return Groups.deleteGroup(accessToken, resourceGroups.items[item].user_group.uuid);

                    case 22:
                      users[groupType] = "";
                      logger.info("Deleted Resource Group: " + resourceGroups.items[item].user_group.group_name);

                    case 24:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, undefined);
            })(), "t2", 14);

          case 14:
            _context4.next = 17;
            break;

          case 16:
            return _context4.abrupt("return", Promise.reject({
              statusCode: 400,
              message: "resource group lookup returned corrupt data"
            }));

          case 17:
            _context4.next = 9;
            break;

          case 19:
            // add any new groups if needed. empty properties were set above
            for (user in users) {
              if (users[user] === "") {
                delete users[user];
              }
            }

            if (!(Object.keys(users).length > 0)) {
              _context4.next = 25;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            logger.info("Creating New Resource Groups For Resource " + resourceUUID + ": " + JSON.stringify(users, null, "\t"));
            _context4.next = 25;
            return createResourceGroups(accessToken, accountUUID, resourceUUID, "object", //system role type
            users, trace);

          case 25:
            _context4.next = 30;
            break;

          case 27:
            _context4.prev = 27;
            _context4.t3 = _context4["catch"](0);
            return _context4.abrupt("return", Promise.reject(_context4.t3));

          case 30:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 27]]);
  }));

  return function updateResourceGroups() {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = {
  createResourceGroups: createResourceGroups,
  cleanUpResourceGroups: cleanUpResourceGroups,
  updateResourceGroups: updateResourceGroups
};