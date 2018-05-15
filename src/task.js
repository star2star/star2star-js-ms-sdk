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
 * @param access_token - access_token for cpaas systems
 * @param userUUID - user UUID to be used
 * @returns promise for list of data object task templates with content
 **/
const getTaskTemplates = (
  userUUID = "null user uuid",
  access_token = "null access_token"
) => {
  return Objects.getDataObjectByType(
    userUUID,
    access_token,
    "task_template",
    true
  );
};

/**
 * This function will create a new task template object
 *
 * @param userUUID string - user UUID to be used
 * @param access_token string - identity access_token
 * @param title string - title of task template
 * @param defaultTasks array objects - array of objects minimium is a title
 * @returns promise for creating object
 **/
const createTaskTemplate = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  title = "missing-stuff",
  description = "task template description", 
  defaultTasks = []
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
  access_token = "null access_token",
  task_template_uuid = "missing task uuid"
) => {
  return Objects.deleteDataObject(access_token, task_template_uuid);
};
/**
 * This function will create a task object (task_list)
 *
 * @param userUUID string - user UUID to be used
 * @param access_token string - identity access_token
 * @param title string - title of task template
 * @param defaultTasks array objects - array of objects minimium is a title
 * @returns promise for creating object
 **/
const createTaskObject = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  title = "Missing Task Title",
  description = "task description default",
  defaultTasks = []
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
      }
    );
  } else {
    return Promise.reject(vTasks);
  }
};
/**
 * This function will delete task list
 *
 * @param userUUID - user UUID to be used
 * @param access_token - identity access_token
 * @param TaskObjectUUID - task list UUID
 * @returns promise
 **/
const deleteTaskObject = (
  access_token = "null access_token",
  task_uuid = "missing task uuid"
) => {
  return Objects.deleteDataObject(access_token, task_uuid);
};

/**
 * This function will retrieve task list
 *
 * @param userUUID - user UUID to be used
 * @param access_token - identity access_token
 * @param TaskObjectUUID - task list UUID
 * @returns promise
 **/
const getTaskObject = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  taskObjectUUID = "null uuid"
) => {
  return Objects.getDataObject(
    userUUID,
    access_token,
    taskObjectUUID,
    true
  );
};

/**
 * This function will update task list
 *
 * @param userUUID - user UUID to be used
 * @param access_token - identity access_token
 * @param TaskObjectUUID - task list UUID
 * @param TaskObject - task object
 * @returns promise
 **/
const updateTaskObject = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  uuid = "missing_uuid",
  taskObject = {}
) => {
  return Objects.updateDataObject(
    userUUID,
    access_token,
    uuid,
    taskObject
  );
};

/**
 * This function will add task to a task object
 *
 * @param userUUID - user UUID to be used
 * @param access_token - identity access_token
 * @param TaskObjectUUID - task list UUID
 * @param Task - individual task which is an object
 * @returns promise
 **/
const addTaskToTaskObject = (
  access_token = "null access_token",
  taskObjectUUID = "missing_uuid",
  task = {}
) => {
  const vTasks = validateTasks([task]);
  if (vTasks.status === 200) {
    return Objects.getDataObject(
      access_token,
      taskObjectUUID,
      true
    ).then(rData => {
      //console.log(rData)
      rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
      return Objects.updateDataObject(
        access_token,
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
 * @param userUUID - user UUID to be used
 * @param access_token - identity access_token
 * @param TaskObjectUUID - task list UUID
 * @param Task - individual task which is an object
 * @returns promise
 **/
const updateTaskInTaskObject = (
  access_token = "null access_token",
  taskObjectUUID = "missing_uuid",
  task = {}
) => {
  const vTasks = validateTasks([task]);
  //console.log('----', vTasks)
  if (vTasks.status === 200) {
    return Objects.getDataObject(access_token, taskObjectUUID).then(
      rData => {
        rData.content.tasks = rData.content.tasks.filter(t => {
          return t.uuid !== vTasks.tasks[0].uuid;
        });
        rData.content.tasks = [].concat(rData.content.tasks, vTasks.tasks);
        return Objects.updateDataObject(
          access_token,
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