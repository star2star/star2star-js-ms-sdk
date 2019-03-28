/* global require module*/
"use strict";

const utilities = require("./utilities");
const Objects = require("./objects");

/**
 *
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {array} [tasks=[]] - array of tasks objects
 * @returns {object} - object containing status, message and tasks
 */
const validateTasks = (tasks = []) => {
  const rStatus = {
    status: 200,
    message: "valid",
    tasks: [].concat(tasks)
  };
  //console.log(rStatus, tasks)
  if (tasks.length <= 0) {
    return rStatus;
  }

  tasks.forEach(t => {
    if (typeof t !== "object") {
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a list of data object task templates with content
 */
const getTaskTemplates = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  trace = {}
) => {
  return Objects.getDataObjectByType(
    userUUID,
    access_token,
    "task_template",
    0, //offset
    100, // limit TODO, this will need to go through utilities aggregator if we get more than 100
    true,
    trace
  );
};

/**
 * @async
 * @description This function will create a new task template object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [title="missing-stuff"] - title of task template
 * @param {string} [description="task template description"] - description of task template
 * @param {array} [defaultTasks=[]] - array of objects; minimium is a title
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
const createTaskTemplate = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  title = "missing-stuff",
  description = "task template description",
  defaultTasks = [],
  trace = {}
) => {
  const vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(
      userUUID,
      access_token,
      title,
      "task_template",
      description,
      {
        tasks: vTasks.tasks
      },
      undefined, //users for shared objects
      trace
    );
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * @async
 * @description This function will delete the task template object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [task_template_uuid="missing task uuid"] - data object UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const deleteTaskTemplate = (
  access_token = "null access_token",
  task_template_uuid = "missing task uuid",
  trace = {}
) => {
  return Objects.deleteDataObject(access_token, task_template_uuid, trace);
};

/**
 * @async
 * @description This function will create a task object (task_list).
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [title="Missing Task Title"] - title of task object
 * @param {string} [description="task description default"] - title of task object
 * @param {array} [defaultTasks=[]] - array of objects; minimium is a title
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
const createTaskObject = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  title = "Missing Task Title",
  description = "task description default",
  defaultTasks = [],
  trace = {}
) => {
  const vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(
      userUUID,
      access_token,
      title,
      "task_list",
      description,
      {
        tasks: vTasks.tasks
      },
      undefined, //users for shared objects
      trace
    );
  } else {
    return Promise.reject(vTasks);
  }
};

/**
 * @async
 * @description This function will delete task list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [task_uuid="missing task uuid"] - task list UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const deleteTaskObject = (
  access_token = "null access_token",
  task_uuid = "missing task uuid",
  trace = {}
) => {
  return Objects.deleteDataObject(access_token, task_uuid, trace);
};

/**
 * @async
 * @description This function will retrieve task list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [taskObjectUUID="null uuid" - task list UUID
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
const getTaskObject = (
  access_token = "null access_token",
  taskObjectUUID = "null uuid",
  trace = {}
) => {
  return Objects.getDataObject(access_token, taskObjectUUID, trace);
};

/**
 * @async
 * @description This function will update task list.
 * @param {string} [userUUID="null user uuid"] - user UUID
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [uuid="missing_uuid"] - task list UUID
 * @param {object} [taskObject={}]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
const updateTaskObject = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  uuid = "missing_uuid",
  taskObject = {},
  trace = {}
) => {
  return Objects.updateDataObject(
    userUUID,
    access_token,
    uuid,
    taskObject,
    trace
  );
};

/**
 * @async
 * @description This function will add task to a task object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [taskObjectUUID="missing_uuid"] - task object UUID
 * @param {object} [task={}] - individual task
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
const addTaskToTaskObject = (
  access_token = "null access_token",
  taskObjectUUID = "missing_uuid",
  task = {},
  trace = {}
) => {
  const vTasks = validateTasks([task]);
  if (vTasks.status === 200) {
    return Objects.getDataObject(access_token, taskObjectUUID, trace).then(
      rData => {
        //console.log(rData)
        rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
        return Objects.updateDataObject(
          access_token,
          taskObjectUUID,
          rData,
          utilities.generateNewMetaData(trace)
        );
      }
    );
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
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a task data object
 */
const updateTaskInTaskObject = (
  access_token = "null access_token",
  taskObjectUUID = "missing_uuid",
  task = {},
  trace = {}
) => {
  const vTasks = validateTasks([task]);
  //console.log('----', vTasks)
  if (vTasks.status === 200) {
    return Objects.getDataObject(access_token, taskObjectUUID, trace).then(
      rData => {
        rData.content.tasks = rData.content.tasks.filter(t => {
          return t.uuid !== vTasks.tasks[0].uuid;
        });
        rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
        return Objects.updateDataObject(
          access_token,
          taskObjectUUID,
          rData,
          utilities.generateNewMetaData(trace)
        );
      }
    );
  } else {
    return Promise.reject(vTasks);
  }
};

module.exports = {
  getTaskTemplates,
  createTaskTemplate,
  deleteTaskTemplate,
  createTaskObject,
  deleteTaskObject,
  getTaskObject,
  updateTaskObject,
  addTaskToTaskObject,
  updateTaskInTaskObject
};
