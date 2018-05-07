/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var request = require("request-promise");
var utilities = require("./utilities");
var Objects = require("./objects");
var objectMerge = require("object-merge");

/**
 * This function will ask the cpaas data object service for a specific object
 *
 * @param array tasks objects - takes in an array of tasks objects
 * @returns object - containing status, message and tasks
 **/
var validateTasks = function validateTasks() {
  var tasks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var rStatus = {
    status: 200,
    message: "valid",
    tasks: [].concat(tasks)
  };
  //console.log(rStatus, tasks)
  if (tasks.length <= 0) {
    return rStatus;
  }

  tasks.forEach(function (t) {
    if ((typeof t === "undefined" ? "undefined" : _typeof(t)) !== "object") {
      //console.log(typeOf(t))
      rStatus.status = 400;
      rStatus.message = "all task must be an object";
    } else {
      // valid object
      ///console.log('a')
      if (!t.hasOwnProperty("title")) {
        rStatus.status = 400;
        rStatus.message = "task is missing title";
      } else {
        !t.hasOwnProperty("uuid") && (t.uuid = utilities.createUUID());
        !t.hasOwnProperty("note") && (t.note = []);
        !t.hasOwnProperty("status") && (t.status = "open");
        //!t.owner && t.owner =
      }
    }
  });

  return rStatus;
};
/**
 * This function will ask the cpaas data object service for a list of task_template objects
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @returns promise for list of data object task templates with content
 **/
var getTaskTemplates = function getTaskTemplates() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";

  return Objects.getDataObjectByType(apiKey, userUUID, identityJWT, "task_template", true);
};

/**
 * This function will create a new task template object
 *
 * @param apiKey string - api key for cpaas systems
 * @param userUUID string - user UUID to be used
 * @param identityJWT string - identity JWT
 * @param title string - title of task template
 * @param defaultTasks array objects - array of objects minimium is a title
 * @returns promise for creating object
 **/
var createTaskTemplate = function createTaskTemplate() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var title = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "missing-stuff";
  var defaultTasks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(apiKey, userUUID, identityJWT, title, "task_template", {
      tasks: vTasks.tasks
    });
  } else {
    return Promise.reject(vTasks);
  }
};
/**
 * This function will delete the task template object
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskTemplateUUID - data object UUID
 * @returns promise
 **/
var deleteTaskTemplate = function deleteTaskTemplate() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var task_template_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing task uuid";

  return Objects.deleteDataObject(apiKey, identityJWT, task_template_uuid);
};
/**
 * This function will create a task object (task_list)
 *
 * @param apiKey string - api key for cpaas systems
 * @param userUUID string - user UUID to be used
 * @param identityJWT string - identity JWT
 * @param title string - title of task template
 * @param defaultTasks array objects - array of objects minimium is a title
 * @returns promise for creating object
 **/
var createTaskObject = function createTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var title = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Missing Task Title";
  var defaultTasks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(apiKey, userUUID, identityJWT, title, "task_list", {
      tasks: vTasks.tasks
    });
  } else {
    return Promise.reject(vTasks);
  }
};
/**
 * This function will delete task list
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskObjectUUID - task list UUID
 * @returns promise
 **/
var deleteTaskObject = function deleteTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var task_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing task uuid";

  return Objects.deleteDataObject(apiKey, identityJWT, task_uuid);
};

/**
 * This function will retrieve task list
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskObjectUUID - task list UUID
 * @returns promise
 **/
var getTaskObject = function getTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var taskObjectUUID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null uuid";

  return Objects.getDataObject(apiKey, userUUID, identityJWT, taskObjectUUID, true);
};

/**
 * This function will update task list
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskObjectUUID - task list UUID
 * @param TaskObject - task object
 * @returns promise
 **/
var updateTaskObject = function updateTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var userUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var identityJWT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null jwt";
  var uuid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "missing_uuid";
  var taskObject = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  return Objects.updateDataObject(apiKey, userUUID, identityJWT, uuid, taskObject);
};

/**
 * This function will add task to a task object
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskObjectUUID - task list UUID
 * @param Task - individual task which is an object
 * @returns promise
 **/
var addTaskToTaskObject = function addTaskToTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var taskObjectUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing_uuid";
  var task = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var vTasks = validateTasks([task]);
  if (vTasks.status === 200) {
    return Objects.getDataObject(apiKey, identityJWT, taskObjectUUID, true).then(function (rData) {
      //console.log(rData)
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(apiKey, identityJWT, taskObjectUUID, rData);
    });
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * This function will update task in a task object
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @param TaskObjectUUID - task list UUID
 * @param Task - individual task which is an object
 * @returns promise
 **/
var updateTaskInTaskObject = function updateTaskInTaskObject() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null api key";
  var identityJWT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null jwt";
  var taskObjectUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing_uuid";
  var task = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var vTasks = validateTasks([task]);
  //console.log('----', vTasks)
  if (vTasks.status === 200) {
    return Objects.getDataObject(apiKey, identityJWT, taskObjectUUID).then(function (rData) {
      rData.content.tasks = rData.content.tasks.filter(function (t) {
        return t.uuid !== vTasks.tasks[0].uuid;
      });
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(apiKey, identityJWT, taskObjectUUID, rData);
    });
  } else {
    return Promise.reject(vTasks);
  }
};

module.exports = {
  getTaskTemplates: getTaskTemplates,
  createTaskTemplate: createTaskTemplate,
  deleteTaskTemplate: deleteTaskTemplate,
  createTaskObject: createTaskObject,
  deleteTaskObject: deleteTaskObject,
  getTaskObject: getTaskObject,
  updateTaskObject: updateTaskObject,
  addTaskToTaskObject: addTaskToTaskObject,
  updateTaskInTaskObject: updateTaskInTaskObject
};