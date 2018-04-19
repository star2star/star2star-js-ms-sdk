/* global require module*/
"use strict";
const request = require("request-promise");
const utilities = require("./utilities");
const Objects = require("./objects");
const objectMerge = require("object-merge");

/**
 * This function will ask the cpaas data object service for a specific object
 *
 * @param array tasks objects - takes in an array of tasks objects
 * @returns object - containing status, message and tasks
 **/
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
 * This function will ask the cpaas data object service for a list of task_template objects
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param identityJWT - identity JWT
 * @returns promise for list of data object task templates with content
 **/
const getTaskTemplates = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  identityJWT = "null jwt"
) => {
  return Objects.getDataObjectByType(
    apiKey,
    userUUID,
    identityJWT,
    "task_template",
    true
  );
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
const createTaskTemplate = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  identityJWT = "null jwt",
  title = "missing-stuff",
  defaultTasks = []
) => {
  const vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(
      apiKey,
      userUUID,
      identityJWT,
      title,
      "task_template", {
        tasks: vTasks.tasks
      }
    );
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
const deleteTaskTemplate = (
  apiKey = "null api key",
  identityJWT = "null jwt",
  task_template_uuid = "missing task uuid"
) => {
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
const createTaskObject = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  identityJWT = "null jwt",
  title = "Missing Task Title",
  defaultTasks = []
) => {
  const vTasks = validateTasks(defaultTasks);
  if (vTasks.status === 200) {
    return Objects.createUserDataObject(
      apiKey,
      userUUID,
      identityJWT,
      title,
      "task_list", {
        tasks: vTasks.tasks
      }
    );
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
const deleteTaskObject = (
  apiKey = "null api key",
  identityJWT = "null jwt",
  task_uuid = "missing task uuid"
) => {
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
const getTaskObject = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  identityJWT = "null jwt",
  taskObjectUUID = "null uuid"
) => {
  return Objects.getDataObject(
    apiKey,
    userUUID,
    identityJWT,
    taskObjectUUID,
    true
  );
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
const updateTaskObject = (
  apiKey = "null api key",
  userUUID = "null user uuid",
  identityJWT = "null jwt",
  uuid = "missing_uuid",
  taskObject = {}
) => {
  return Objects.updateDataObject(
    apiKey,
    userUUID,
    identityJWT,
    uuid,
    taskObject
  );
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
const addTaskToTaskObject = (
  apiKey = "null api key",
  identityJWT = "null jwt",
  taskObjectUUID = "missing_uuid",
  task = {}
) => {
  const vTasks = validateTasks([task]);
  if (vTasks.status === 200) {
    return Objects.getDataObject(
      apiKey,
      identityJWT,
      taskObjectUUID,
      true
    ).then(rData => {
      //console.log(rData)
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(
        apiKey,
        identityJWT,
        taskObjectUUID,
        rData
      );
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
const updateTaskInTaskObject = (
  apiKey = "null api key",
  identityJWT = "null jwt",
  taskObjectUUID = "missing_uuid",
  task = {}
) => {
  const vTasks = validateTasks([task]);
  //console.log('----', vTasks)
  if (vTasks.status === 200) {
    return Objects.getDataObject(apiKey, identityJWT, taskObjectUUID).then(
      rData => {
        rData.content.tasks = rData.content.tasks.filter(t => {
          return t.uuid !== vTasks.tasks[0].uuid;
        });
        rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
        return Objects.updateDataObject(
          apiKey,
          identityJWT,
          taskObjectUUID,
          rData
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