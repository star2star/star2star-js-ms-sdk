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
 * @param {string} [type=undefined] - resource type, object, etc.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to an object containing a status message
 */
var createResourceGroups = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
    var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
    var resourceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null resourceUUID";
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var nextTrace, groupPromises, scopePromises, groupTypeRegex, groups, scopes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (type) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", Promise.reject({
              "statusCode": 400,
              "message": "Unable to create resource groups. Resource type not defined."
            }));

          case 3:
            //create the groups
            nextTrace = objectMerge({}, trace);
            groupPromises = [];
            scopePromises = [];
            groupTypeRegex = /^[r,u,d]{1,3}/;

            Object.keys(users).forEach(function (prop) {
              var userGroup = {
                name: prop + ": " + resourceUUID,
                users: [].concat(_toConsumableArray(users[prop])),
                description: "resource group"
              };
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
              groupPromises.push(Auth.createUserGroup(accessToken, accountUUID, userGroup, nextTrace));
            });

            _context.next = 10;
            return Promise.all(groupPromises);

          case 10:
            groups = _context.sent;


            logger.info("Created resource groups: " + JSON.stringify(groups, null, "\t"));
            _context.next = 14;
            return new Promise(function (resolve) {
              return setTimeout(resolve, msDelay);
            });

          case 14:
            //microservices delay :(

            // scope the resource to the groups
            groups.forEach(function (group) {
              //extract the group type from the group name
              var groupType = groupTypeRegex.exec(group.name);
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
              scopePromises.push(Auth.assignScopedRoleToUserGroup(accessToken, group.uuid, roles[type][groupType], "resource", [resourceUUID], nextTrace));
            });
            _context.next = 17;
            return Promise.all(scopePromises);

          case 17:
            scopes = _context.sent;

            logger.info("Completed resource group scoping calls: " + JSON.stringify(scopes, null, "\t"));
            return _context.abrupt("return", Promise.resolve({ status: "ok" }));

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject({ status: "failed", createResourceGroups: _context.t0 }));

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
    var resourceGroups, nextTrace, groupsToDelete;
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
              _context2.next = 12;
              break;
            }

            nextTrace = objectMerge({}, trace);
            groupsToDelete = [];

            resourceGroups.items.forEach(function (group) {
              groupsToDelete.push(Groups.deleteGroup(accessToken, group.user_group.uuid, nextTrace));
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            });
            _context2.next = 11;
            return Promise.all(groupsToDelete);

          case 11:
            Promise.resolve({ "status": "ok" });

          case 12:
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject({
              "status": "failed",
              "cleanUpResourceGroups": _context2.t0
            }));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 14]]);
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
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
    var accountUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null accountUUID";
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var nextTrace, resourceGroups, groupTypeRegex, updatePromises, deletePromises, userGroups, memberUpdatePromises;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (type) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", Promise.reject({
              "statusCode": 400,
              "message": "Unable to update resource groups. Resource type not defined."
            }));

          case 3:
            nextTrace = objectMerge({}, trace);
            _context3.next = 6;
            return Auth.listAccessByGroups(accessToken, resourceUUID, nextTrace);

          case 6:
            resourceGroups = _context3.sent;

            logger.info("Resource group lookup success for " + resourceUUID + ": " + JSON.stringify(resourceGroups, null, "\t"));

            if (!(resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0)) {
              _context3.next = 26;
              break;
            }

            //extract the type of group from the name
            groupTypeRegex = /^[r,u,d]{1,3}/;
            updatePromises = [];
            deletePromises = [];

            resourceGroups.items.forEach(function (item) {
              logger.debug("resource group item: " + JSON.stringify(item, null, "\t"));
              if (item.hasOwnProperty("user_group") && item.user_group.hasOwnProperty("group_name")) {
                var groupType = groupTypeRegex.exec(item.user_group.group_name);
                // A resource group exists for this set of permissions.
                if ((typeof users === "undefined" ? "undefined" : _typeof(users)) === "object" && users.hasOwnProperty(groupType)) {
                  nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                  updatePromises.push(Groups.getGroup(accessToken, item.user_group.uuid, {
                    expand: "members",
                    members_limit: 999 //hopefully we don't need pagination here. nh TODO call util.aggregate?
                  }, nextTrace));
                } else {
                  // we no longer have any users for this resource group, so delete it
                  deletePromises.push(Groups.deleteGroup(accessToken, item.user_group.uuid));
                }
              } else {
                // Unexpected item format. Bail out....
                return Promise.reject({
                  statusCode: 400,
                  message: "resource group lookup returned corrupt data"
                });
              }
            });
            logger.debug("updatePromises: " + JSON.stringify(updatePromises, null, "\t"));
            _context3.next = 16;
            return Promise.all(updatePromises);

          case 16:
            userGroups = _context3.sent;

            logger.info("user_groups with members lookup success: " + JSON.stringify(userGroups, null, "\t"));
            // update the groups' members
            memberUpdatePromises = [];

            userGroups.forEach(function (group) {
              //add the new users to the group
              var groupType = groupTypeRegex.exec(group.name);
              logger.debug("groupType for updating members: " + JSON.stringify(groupType, null, "\t"));
              var addUsers = users[groupType].filter(function (user) {
                var found = false;
                group.members.items.forEach(function (groupUser) {
                  if (!found) {
                    user === groupUser.uuid ? found = true : found = false;
                  }
                });
                return !found;
              }).map(function (user) {
                return { uuid: user, type: "user" };
              });
              if (addUsers && addUsers.length > 0) {
                nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                memberUpdatePromises.push(Groups.addMembersToGroup(accessToken, group.uuid, addUsers, nextTrace));
              }
              //delete the old users from the group
              var deleteUsers = group.members.items.filter(function (groupUser) {
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
              if (deleteUsers && deleteUsers.length > 0) {
                nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                memberUpdatePromises.push(Groups.deleteGroupMembers(accessToken, group.uuid, deleteUsers, nextTrace));
              }
              // remove the group type property from the users object
              // any remaining are for new groups which will be created below
              delete users[groupType];
            });
            logger.debug("memberUpdatePromises: " + JSON.stringify(memberUpdatePromises, null, "\t"));
            _context3.next = 23;
            return Promise.all(memberUpdatePromises);

          case 23:
            logger.debug("deletePromises: " + JSON.stringify(deletePromises, null, "\t"));
            _context3.next = 26;
            return Promise.all(deletePromises);

          case 26:
            if (!(Object.keys(users).length > 0)) {
              _context3.next = 31;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            logger.info("Creating New Resource Groups For Resource " + resourceUUID + ": " + JSON.stringify(users, null, "\t"));
            _context3.next = 31;
            return createResourceGroups(accessToken, accountUUID, resourceUUID, "object", //system role type
            users, trace);

          case 31:
            return _context3.abrupt("return", Promise.resolve({ "status": "ok" }));

          case 34:
            _context3.prev = 34;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", Promise.reject({
              "status": "failed",
              "updateResourceGroups": _context3.t0
            }));

          case 37:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 34]]);
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