/* global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.array.slice.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.filter.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Util = require("./utilities");

var Auth = require("./auth");

var Groups = require("./groups");

var objectMerge = require("object-merge");

var Logger = require("./node-logger");

var logger = new Logger.default();
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

var createResourceGroups = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        accountUUID,
        resourceUUID,
        type,
        users,
        trace,
        nextTrace,
        roles,
        groupPromises,
        scopePromises,
        groupTypeRegex,
        groups,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access token";
            accountUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null accountUUID";
            resourceUUID = _args.length > 2 && _args[2] !== undefined ? _args[2] : "null resourceUUID";
            type = _args.length > 3 && _args[3] !== undefined ? _args[3] : undefined;
            users = _args.length > 4 && _args[4] !== undefined ? _args[4] : {};
            trace = _args.length > 5 && _args[5] !== undefined ? _args[5] : {};
            _context.prev = 6;
            logger.debug("Creating Resource Group ".concat(resourceUUID, ". Users Object:"), users);

            if (type) {
              _context.next = 10;
              break;
            }

            throw {
              "code": 400,
              "message": "Unable to create resource groups. Resource type not defined."
            };

          case 10:
            //create the groups
            nextTrace = objectMerge({}, trace);
            _context.next = 13;
            return Auth.getResourceGroupRoles(accessToken, nextTrace);

          case 13:
            roles = _context.sent;

            if (!(Object.keys(roles).length === 0)) {
              _context.next = 16;
              break;
            }

            throw {
              "code": "404",
              "message": "resource group system roles not found"
            };

          case 16:
            groupPromises = [];
            scopePromises = [];
            groupTypeRegex = /^[r,u,d]{1,3}/;
            Object.keys(users).forEach(function (prop) {
              var userGroup = {
                name: "".concat(prop, ": ").concat(resourceUUID),
                users: _toConsumableArray(users[prop]),
                description: "resource group"
              };
              logger.debug("Creating Resource Group. User-Group:", userGroup);
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
              groupPromises.push(Auth.createUserGroup(accessToken, accountUUID, userGroup, nextTrace));
            });
            _context.next = 22;
            return Promise.all(groupPromises);

          case 22:
            groups = _context.sent;
            logger.debug("Creating Resource Group, Created User Groups:", groups); // scope the resource to the groups

            groups.forEach(function (group) {
              //extract the group type from the group name
              var groupType = groupTypeRegex.exec(group.name);
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
              scopePromises.push(Auth.assignScopedRoleToUserGroup(accessToken, group.uuid, roles[type][groupType], "resource", [resourceUUID], nextTrace));
              logger.debug("Creating Resource Group. Scope Params:", "group.uuid: ".concat(group.uuid), "roles[type][groupType]: ".concat(roles[type][groupType]), "[resourceUUID]: [".concat(resourceUUID, "]"));
            });
            _context.next = 27;
            return Promise.all(scopePromises);

          case 27:
            return _context.abrupt("return", {
              status: "ok"
            });

          case 30:
            _context.prev = 30;
            _context.t0 = _context["catch"](6);
            logger.debug("Creating Resource Group Failed", _context.t0);
            return _context.abrupt("return", Promise.reject(Util.formatError(_context.t0)));

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 30]]);
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


var cleanUpResourceGroups = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        resourceUUID,
        trace,
        resourceGroups,
        nextTrace,
        groupsToDelete,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null accessToken";
            resourceUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null resourceUUID";
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            logger.debug("Cleaning up Resource Groups For ".concat(resourceUUID));
            _context2.next = 7;
            return Auth.listAccessByGroups(accessToken, resourceUUID, trace);

          case 7:
            resourceGroups = _context2.sent;

            if (!(resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0)) {
              _context2.next = 16;
              break;
            }

            nextTrace = objectMerge({}, trace);
            groupsToDelete = [];
            resourceGroups.items.forEach(function (group) {
              groupsToDelete.push(Groups.deleteGroup(accessToken, group.user_group.uuid, nextTrace));
              nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            });
            _context2.next = 14;
            return Promise.all(groupsToDelete);

          case 14:
            logger.debug("Cleaning up Resource Groups Successful");
            return _context2.abrupt("return", {
              "status": "ok"
            });

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](3);
            logger.debug("Cleaning up Resource Groups Failed", _context2.t0);
            return _context2.abrupt("return", Promise.reject(Util.formatError(_context2.t0)));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 18]]);
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


var updateResourceGroups = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        resourceUUID,
        accountUUID,
        type,
        users,
        trace,
        nextTrace,
        resourceGroups,
        groupTypeRegex,
        updatePromises,
        deletePromises,
        userGroups,
        memberUpdatePromises,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null accessToken";
            resourceUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "uuid not specified";
            accountUUID = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null accountUUID";
            type = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : undefined;
            users = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {};
            trace = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : {};
            _context3.prev = 6;

            if (type) {
              _context3.next = 9;
              break;
            }

            throw {
              "code": 400,
              "message": "Unable to update resource groups. Resource type not defined."
            };

          case 9:
            logger.debug("Updating Resource Groups For ".concat(resourceUUID));
            nextTrace = objectMerge({}, trace);
            _context3.next = 13;
            return Auth.listAccessByGroups(accessToken, resourceUUID, nextTrace);

          case 13:
            resourceGroups = _context3.sent;
            logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Groups Found"), resourceGroups);

            if (!(resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0)) {
              _context3.next = 29;
              break;
            }

            //extract the type of group from the name
            groupTypeRegex = /^[r,u,d]{1,3}/;
            updatePromises = [];
            deletePromises = [];
            resourceGroups.items.forEach(function (item) {
              if (item.hasOwnProperty("user_group") && item.user_group.hasOwnProperty("group_name")) {
                var groupType = groupTypeRegex.exec(item.user_group.group_name);
                logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Group Type"), groupType); // A resource group exists for this set of permissions.

                if (_typeof(users) === "object" && users.hasOwnProperty(groupType) && users[groupType].length > 0) {
                  logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Fetching Group"), item.user_group.uuid);
                  nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                  updatePromises.push(Groups.getGroup(accessToken, item.user_group.uuid, {
                    expand: "members",
                    members_limit: 999 //hopefully we don't need pagination here. nh TODO call util.aggregate?

                  }, nextTrace));
                } else {
                  // we no longer have any users for this resource group, so delete it
                  logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Deleting Group"), item.user_group.uuid);
                  nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                  deletePromises.push(Groups.deleteGroup(accessToken, item.user_group.uuid, trace));
                }
              } else {
                // Unexpected item format. Bail out....
                throw {
                  code: 400,
                  message: "resource group lookup returned corrupt data"
                };
              }
            });
            _context3.next = 22;
            return Promise.all(updatePromises);

          case 22:
            userGroups = _context3.sent;
            // update the groups' members
            memberUpdatePromises = [];
            userGroups.forEach(function (group) {
              //add the new users to the group
              var groupType = groupTypeRegex.exec(group.name);
              var addUsers = users[groupType].filter(function (user) {
                var found = false;
                group.members.items.forEach(function (groupUser) {
                  if (!found) {
                    user === groupUser.uuid ? found = true : found = false;
                  }
                });
                return !found;
              }).map(function (user) {
                return {
                  uuid: user,
                  type: "user"
                };
              });

              if (addUsers && addUsers.length > 0) {
                nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                memberUpdatePromises.push(Groups.addMembersToGroup(accessToken, group.uuid, addUsers, nextTrace));
              } //delete the old users from the group


              var deleteUsers = group.members.items.filter(function (groupUser) {
                var found = false;
                users[groupType].forEach(function (user) {
                  if (!found) {
                    user === groupUser.uuid ? found = true : found = false;
                  }
                });
                return !found;
              }).map(function (groupUser) {
                return {
                  uuid: groupUser.uuid
                };
              });

              if (deleteUsers && deleteUsers.length > 0) {
                nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
                memberUpdatePromises.push(Groups.deleteGroupMembers(accessToken, group.uuid, deleteUsers, nextTrace));
              } // remove the group type property from the users object
              // any remaining are for new groups which will be created below


              delete users[groupType];
            });
            _context3.next = 27;
            return Promise.all(memberUpdatePromises);

          case 27:
            _context3.next = 29;
            return Promise.all(deletePromises);

          case 29:
            if (!(Object.keys(users).length > 0)) {
              _context3.next = 34;
              break;
            }

            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Creating New Groups"), users);
            _context3.next = 34;
            return createResourceGroups(accessToken, accountUUID, resourceUUID, "object", //system role type
            users, trace);

          case 34:
            return _context3.abrupt("return", {
              "status": "ok"
            });

          case 37:
            _context3.prev = 37;
            _context3.t0 = _context3["catch"](6);
            logger.debug("Updating Resource Groups For ".concat(resourceUUID, " Failed"), _context3.t0);
            return _context3.abrupt("return", Promise.reject(Util.formatError(_context3.t0)));

          case 41:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 37]]);
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