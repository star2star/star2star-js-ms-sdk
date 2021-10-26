// TODO update tov1 API when available...

/*global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var util = require("./utilities");

var Groups = require("./groups");

var request = require("request-promise");

var objectMerge = require("object-merge");
/**
 * @async
 * @description This function will create a new room.
 * @param {string} [access_token="null access token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [name="no name specified for group"] - name
 * @param {string} [topic="no topic specified"] - topic
 * @param {string} [description=undefined] - description
 * @param {string} [groupUUID=undefined] - group UUID for members
 * @param {string} [accountUUID=undefined] - account uuid
 * @param {object} [metadata={}] - object for meta data
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var createRoom = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var access_token,
        userUUID,
        name,
        topic,
        description,
        groupUUID,
        accountUUID,
        metadata,
        trace,
        MS,
        b,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            access_token = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access token";
            userUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null user uuid";
            name = _args.length > 2 && _args[2] !== undefined ? _args[2] : "no name specified for group";
            topic = _args.length > 3 && _args[3] !== undefined ? _args[3] : "no topic specified";
            description = _args.length > 4 && _args[4] !== undefined ? _args[4] : undefined;
            groupUUID = _args.length > 5 && _args[5] !== undefined ? _args[5] : undefined;
            accountUUID = _args.length > 6 && _args[6] !== undefined ? _args[6] : undefined;
            metadata = _args.length > 7 && _args[7] !== undefined ? _args[7] : {};
            trace = _args.length > 8 && _args[8] !== undefined ? _args[8] : {};
            _context.prev = 9;
            MS = util.getEndpoint("chat");
            b = {
              name: name,
              topic: topic,
              description: description,
              account_uuid: accountUUID,
              group_uuid: groupUUID,
              owner_uuid: userUUID,
              metadata: metadata
            }; //console.log('bbbbbbbb', b)

            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/rooms"),
              body: b,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 16;
            return request(requestOptions);

          case 16:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](9);
            Promise.reject(util.formatError(_context.t0));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 20]]);
  }));

  return function createRoom() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will list rooms.
 * @param {string} [access_token="null acess token"] - access token for cpaas systems
 * @param {object} [filter=undefined] - optional object,
  * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var listRooms = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var access_token,
        filter,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            access_token = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null acess token";
            filter = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : undefined;
            trace = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            _context2.prev = 3;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/rooms"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };

            if (filter !== undefined) {
              requestOptions.qs = filter;
            }

            util.addRequestTrace(requestOptions, trace);
            _context2.next = 10;
            return request(requestOptions);

          case 10:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](3);
            Promise.reject(util.formatError(_context2.t0));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 14]]);
  }));

  return function listRooms() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get a specific room.
 * @param {string} [access_token="null access token"] - access token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var getRoom = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var access_token,
        roomUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            access_token = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null access token";
            roomUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "no room uuid specified";
            trace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            _context3.prev = 3;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/rooms/").concat(roomUUID),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](3);
            Promise.reject(util.formatError(_context3.t0));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 13]]);
  }));

  return function getRoom() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a room.
 * @param {string} [access_token="null acess token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise with no payload
 */


var deleteRoom = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var access_token,
        roomUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            access_token = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null acess token";
            roomUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "no room uuid specified";
            trace = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            _context4.prev = 3;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/rooms/").concat(roomUUID),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 9;
            return request(requestOptions);

          case 9:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](3);
            Promise.reject(util.formatError(_context4.t0));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 13]]);
  }));

  return function deleteRoom() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will update room info
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [info={}] - object containing attributes to update
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var updateRoomInfo = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var access_token,
        roomUUID,
        info,
        trace,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            access_token = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null access_token";
            roomUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "no room uuid specified";
            info = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            trace = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
            _context5.prev = 4;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/info"),
              body: info,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 10;
            return request(requestOptions);

          case 10:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](4);
            Promise.reject(util.formatError(_context5.t0));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 14]]);
  }));

  return function updateRoomInfo() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will udpate room meta
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} [meta={}] - metedata object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var updateRoomMeta = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var access_token,
        roomUUID,
        meta,
        trace,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            access_token = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null access_token";
            roomUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "no room uuid specified";
            meta = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
            trace = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
            _context6.prev = 4;
            MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/meta"),
              body: meta,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context6.next = 10;
            return request(requestOptions);

          case 10:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](4);
            Promise.reject(util.formatError(_context6.t0));

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 14]]);
  }));

  return function updateRoomMeta() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will return a list of room members.
 * @param {string} [access_token="null access_token"]
 * @param {string} [roomUUID="no room uuid specified"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var getRoomMembers = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var access_token,
        roomUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            access_token = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null access_token";
            roomUUID = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "no room uuid specified";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context7.next = 9;
            return request(requestOptions);

          case 9:
            response = _context7.sent;
            return _context7.abrupt("return", response);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](3);
            Promise.reject(util.formatError(_context7.t0));

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 13]]);
  }));

  return function getRoomMembers() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will add a member to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas system
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {object} memberData - object {"uuid": "string","type": "string"}
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */


var addMember = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var access_token,
        roomUUID,
        memberData,
        trace,
        MS,
        requestOptions,
        response,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            access_token = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null access_token";
            roomUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "no room uuid specified";
            memberData = _args8.length > 2 ? _args8[2] : undefined;
            trace = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : {};
            _context8.prev = 4;
            MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members"),
              body: memberData,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context8.next = 10;
            return request(requestOptions);

          case 10:
            response = _context8.sent;
            return _context8.abrupt("return", response);

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8["catch"](4);
            Promise.reject(util.formatError(_context8.t0));

          case 17:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[4, 14]]);
  }));

  return function addMember() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a member from room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - member to remove
 * @param {string} [memberUUID="empty"] - member to remove
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a member data object
 */


var deleteMember = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var access_token,
        roomUUID,
        memberUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            access_token = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null access_token";
            roomUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "no room uuid specified";
            memberUUID = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : "empty";
            trace = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : {};
            _context9.prev = 4;
            MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/members/").concat(memberUUID),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context9.next = 10;
            return request(requestOptions);

          case 10:
            response = _context9.sent;
            return _context9.abrupt("return", response);

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](4);
            Promise.reject(util.formatError(_context9.t0));

          case 17:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[4, 14]]);
  }));

  return function deleteMember() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get room messages.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {number} [max=100] - number of messages
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object containing a colelction of message objects.
 */


var getMessages = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var access_token,
        roomUUID,
        max,
        trace,
        MS,
        requestOptions,
        response,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            access_token = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "null access_token";
            roomUUID = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "no room uuid specified";
            max = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : 100;
            trace = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            _context10.prev = 4;
            MS = util.getEndpoint("chat"); //console.log('mmmmmmm', meta)

            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/messages"),
              qs: {
                max: max
              },
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context10.next = 10;
            return request(requestOptions);

          case 10:
            response = _context10.sent;
            return _context10.abrupt("return", response);

          case 14:
            _context10.prev = 14;
            _context10.t0 = _context10["catch"](4);
            Promise.reject(util.formatError(_context10.t0));

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[4, 14]]);
  }));

  return function getMessages() {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will post a message to a room.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [roomUUID="no room uuid specified"] - room uuid
 * @param {string} [message="missing text"] - message
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var sendMessage = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var access_token,
        userUUID,
        roomUUID,
        message,
        trace,
        MS,
        b,
        requestOptions,
        response,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            access_token = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : "null access_token";
            userUUID = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "null user uuid";
            roomUUID = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : "no room uuid specified";
            message = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : "missing text";
            trace = _args11.length > 4 && _args11[4] !== undefined ? _args11[4] : {};
            _context11.prev = 5;
            MS = util.getEndpoint("chat");
            b = {
              content: {
                contentType: "string",
                content: message
              },
              user_uuid: userUUID
            };
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/rooms/").concat(roomUUID, "/messages"),
              body: b,
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(access_token),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context11.next = 12;
            return request(requestOptions);

          case 12:
            response = _context11.sent;
            return _context11.abrupt("return", response);

          case 16:
            _context11.prev = 16;
            _context11.t0 = _context11["catch"](5);
            Promise.reject(util.formatError(_context11.t0));

          case 19:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[5, 16]]);
  }));

  return function sendMessage() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get room info, messages, and members.
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [roomUUID="no room uuid specified"] - string message
 * @param {number} [message_count=100]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */


var getRoomInfo = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var access_token,
        roomUUID,
        message_count,
        trace,
        newMeta,
        pInfo,
        nextMeta,
        pMessages,
        pData,
        groupData,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            access_token = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "null access_token";
            roomUUID = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "no room uuid specified";
            message_count = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 100;
            trace = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : {};
            _context12.prev = 4;
            newMeta = util.generateNewMetaData;
            pInfo = getRoom(access_token, roomUUID, trace);
            nextMeta = objectMerge({}, trace, newMeta(trace));
            pMessages = getMessages(access_token, roomUUID, message_count, nextMeta);
            _context12.next = 11;
            return Promise.all([pInfo, pMessages]);

          case 11:
            pData = _context12.sent;
            nextMeta = objectMerge({}, trace, newMeta(trace));
            _context12.next = 15;
            return Groups.getGroup(access_token, pData[0].group_uuid, nextMeta);

          case 15:
            groupData = _context12.sent;
            return _context12.abrupt("return", {
              info: pData[0],
              members: groupData.members,
              messages: pData[1].items
            });

          case 19:
            _context12.prev = 19;
            _context12.t0 = _context12["catch"](4);
            Promise.reject(util.formatError(_context12.t0));

          case 22:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[4, 19]]);
  }));

  return function getRoomInfo() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will send a message to a chat channel
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [channelUUID="null channelUUID"] - channel uuid
 * @param {string|array} [content=undefined] - message content, string or array
 * @param {object} [trace={}] - optional CPaaS request lifecycle headers
 * @returns {Promise<object>} - promise resolving to a message confirmation object
 */


var sendMessageToChannel = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        channelUUID,
        content,
        trace,
        MS,
        requestOptions,
        response,
        _args13 = arguments;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            accessToken = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : "null accessToken";
            channelUUID = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : "null channelUUID";
            content = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : undefined;
            trace = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : {};
            _context13.prev = 4;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/channels/").concat(channelUUID, "/messages"),
              headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              "body": {},
              "json": true
            };

            if (!(typeof content === "string")) {
              _context13.next = 11;
              break;
            }

            requestOptions.body.content = {
              "contentType": "plain/text",
              "content": content
            };
            _context13.next = 16;
            break;

          case 11:
            if (!Array.isArray(content)) {
              _context13.next = 15;
              break;
            }

            requestOptions.body.content = {
              "contentType": "multipart",
              "parts": content
            };
            _context13.next = 16;
            break;

          case 15:
            throw {
              "code": 400,
              "message": "content must be string or array. received ".concat(_typeof(content))
            };

          case 16:
            util.addRequestTrace(requestOptions, trace);
            _context13.next = 19;
            return request(requestOptions);

          case 19:
            response = _context13.sent;
            return _context13.abrupt("return", response);

          case 23:
            _context13.prev = 23;
            _context13.t0 = _context13["catch"](4);
            throw util.formatError(_context13.t0);

          case 26:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[4, 23]]);
  }));

  return function sendMessageToChannel() {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will send a message to a chat channel
 * @param {string} [accessToken="null accessToken"] - CPaaS access token
 * @param {string} [userUUID="null userUUID"] - user uuid
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {string} [offset=0] - pagination offset
 * @param {string} [limit=10] - pagination limit
 * @param {object} [trace={}] - optional CPaaS request lifecycle headers
 * @returns {Promise<object>} - promise resolving to a list of channel objects
 */


var listUsersChannels = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var accessToken,
        userUUID,
        accountUUID,
        offset,
        limit,
        trace,
        MS,
        requestOptions,
        response,
        _args14 = arguments;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            accessToken = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : "null accessToken";
            userUUID = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : "null userUUID";
            accountUUID = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : "null accountUUID";
            offset = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : 0;
            limit = _args14.length > 4 && _args14[4] !== undefined ? _args14[4] : 10;
            trace = _args14.length > 5 && _args14[5] !== undefined ? _args14[5] : {};
            _context14.prev = 6;
            MS = util.getEndpoint("chat");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/channels"),
              headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion()),
                "x-user-uuid": userUUID
              },
              "qs": {
                "account_uuid": accountUUID,
                "offset": offset,
                "limit": limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context14.next = 12;
            return request(requestOptions);

          case 12:
            response = _context14.sent;
            return _context14.abrupt("return", response);

          case 16:
            _context14.prev = 16;
            _context14.t0 = _context14["catch"](6);
            throw util.formatError(_context14.t0);

          case 19:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[6, 16]]);
  }));

  return function listUsersChannels() {
    return _ref14.apply(this, arguments);
  };
}();

module.exports = {
  createRoom: createRoom,
  deleteRoom: deleteRoom,
  listRooms: listRooms,
  getRoom: getRoom,
  updateRoomInfo: updateRoomInfo,
  updateRoomMeta: updateRoomMeta,
  getRoomMembers: getRoomMembers,
  addMember: addMember,
  deleteMember: deleteMember,
  getMessages: getMessages,
  sendMessage: sendMessage,
  getRoomInfo: getRoomInfo,
  sendMessageToChannel: sendMessageToChannel,
  listUsersChannels: listUsersChannels
};