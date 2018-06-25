/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var request = require("request-promise");
var utilities = require("./utilities");
var Objects = require("./objects");
var objectMerge = require("object-merge");

/**
 *
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {array} [tasks=[]] - array of tasks objects
 * @returns {object} - object containing status, message and tasks
 */
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
 * @async
 * @description This function will ask the cpaas data object service for a list of task_template objects.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to a list of data object task templates with content
 */
var getTaskTemplates = function getTaskTemplates() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var access_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null access_token";

  return Objects.getDataObjectByType(userUUID, access_token, "task_template", true);
};

/**
 * @async
 * @description This function will create a new task template object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [title="missing-stuff"] - title of task template
 * @param {string} [description="task template description"] - description of task template 
 * @param {array} [defaultTasks=[]] - array of objects; minimium is a title
 * @returns
 */
var createTaskTemplate = function createTaskTemplate() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var access_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null access_token";
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing-stuff";
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "task template description";
  var defaultTasks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(userUUID, access_token, title, "task_template", description, {
      tasks: vTasks.tasks
    });
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * @async
 * @description This function will delete the task template object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [task_template_uuid="missing task uuid"] - data object UUID
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var deleteTaskTemplate = function deleteTaskTemplate() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var task_template_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing task uuid";

  return Objects.deleteDataObject(access_token, task_template_uuid);
};

/**
 * @async
 * @description This function will create a task object (task_list).
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [title="Missing Task Title"] - title of task object
 * @param {string} [description="task description default"] - title of task object
 * @param {array} [defaultTasks=[]] - array of objects; minimium is a title
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
var createTaskObject = function createTaskObject() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var access_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null access_token";
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Missing Task Title";
  var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "task description default";
  var defaultTasks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(userUUID, access_token, title, "task_list", description, {
      tasks: vTasks.tasks
    });
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * @async
 * @description This function will delete task list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [task_uuid="missing task uuid"] - task list UUID
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var deleteTaskObject = function deleteTaskObject() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var task_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing task uuid";

  return Objects.deleteDataObject(access_token, task_uuid);
};

/**
 * @async
 * @description This function will retrieve task list.
 * @param {string} [userUUID="null user uuid"] - user UUID
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [taskObjectUUID="null uuid" - task list UUID
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
var getTaskObject = function getTaskObject() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var access_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null access_token";
  var taskObjectUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null uuid";

  return Objects.getDataObject(userUUID, access_token, taskObjectUUID, true);
};

/**
 * @async
 * @description This function will update task list.
 * @param {string} [userUUID="null user uuid"] - user UUID
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [uuid="missing_uuid"] - task list UUID
 * @param {object} [taskObject={}]
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
var updateTaskObject = function updateTaskObject() {
  var userUUID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null user uuid";
  var access_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null access_token";
  var uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "missing_uuid";
  var taskObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return Objects.updateDataObject(userUUID, access_token, uuid, taskObject);
};

/**
 * @async
 * @description This function will add task to a task object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [taskObjectUUID="missing_uuid"] - task object UUID
 * @param {object} [task={}] - individual task
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
var addTaskToTaskObject = function addTaskToTaskObject() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var taskObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing_uuid";
  var task = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var vTasks = validateTasks([task]);
  if (vTasks.status === 200) {
    return Objects.getDataObject(access_token, taskObjectUUID, true).then(function (rData) {
      //console.log(rData)
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(access_token, taskObjectUUID, rData);
    });
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * @async
 * @description This function will update a task in a task object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [taskObjectUUID="missing_uuid"] - task object UUID
 * @param {object} [task={}] - updated task object
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
var updateTaskInTaskObject = function updateTaskInTaskObject() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var taskObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing_uuid";
  var task = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var vTasks = validateTasks([task]);
  //console.log('----', vTasks)
  if (vTasks.status === 200) {
    return Objects.getDataObject(access_token, taskObjectUUID).then(function (rData) {
      rData.content.tasks = rData.content.tasks.filter(function (t) {
        return t.uuid !== vTasks.tasks[0].uuid;
      });
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(access_token, taskObjectUUID, rData);
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