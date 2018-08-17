/* global require module*/
"use strict";
const request = require("request-promise");
const utilities = require("./utilities");
const Objects = require("./objects");
const objectMerge = require("object-merge");


/* FIXME Update Validation When Project Object Format is Confirmed
 * Template related calls are stubbed out and not complete
 * NH 08/16/18
 */

/**
 *
 * @description This function will ask the cpaas data object service for a specific object.
 * @param {array} [projects=[]] - array of projects objects
 * @returns {object} - object containing status, message and projects
 */
const validateProjects = (projects = []) => {
  const rStatus = {
    status: 200,
    message: "valid",
    projects: [].concat(projects)
  };
  //console.log(rStatus, projects)
  if (projects.length <= 0) {
    return rStatus;
  }

  projects.forEach(project => {
    if (typeof project !== "object") {
      //console.log(typeOf(t))
      rStatus.status = 400;
      rStatus.message = "all project must be an object";
    } else {
      // valid object
      ///console.log('a')
      if (!project.hasOwnProperty("title")) {
        rStatus.status = 400;
        rStatus.message = "project is missing title";
      } else {
        !project.hasOwnProperty("uuid") && (project.uuid = utilities.createUUID());
        !project.hasOwnProperty("note") && (project.note = []);
        !project.hasOwnProperty("status") && (project.status = "open");
        //!project.owner && project.owner =
      }
    }
  });

  return rStatus;
};

/**
 * @async
 * @description This function will ask the cpaas data object service for a list of project_template objects.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @returns {Promise<object>} - Promise resolving to a list of data object project templates with content
 */
const getProjectTemplates = (
  userUUID = "null user uuid",
  access_token = "null access_token"
) => {
  return Objects.getDataObjectByType(
    userUUID,
    access_token,
    "project_template",
    true
  );
};

/**
 * @async
 * @description This function will create a new project template object.
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [access_token="null access_token"] - access_token for cpaas systems
 * @param {string} [title="missing-stuff"] - title of project template
 * @param {string} [description="project template description"] - description of project template 
 * @param {array} [defaultProjects=[]] - array of objects; minimium is a title
 * @returns
 */
const createProjectTemplate = (
  userUUID = "null user uuid",
  access_token = "null access_token",
  title = "missing-stuff",
  description = "project template description", 
  defaultProjects = []
) => {
  const vProjects = validateProjects(defaultProjects);
  if (vProjects.status === 200) {
    return Objects.createUserDataObject(
      userUUID,
      access_token,
      title,
      "project_template", 
      description, 
      {
        projects: vProjects.projects
      }
    );
  } else {
    return Promise.reject(vProjects);
  }
};

/**
 * @async
 * @description This function will delete the project template object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [project_template_uuid="missing project uuid"] - data object UUID
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
const deleteProjectTemplate = (
  access_token = "null access_token",
  project_template_uuid = "missing project uuid"
) => {
  return Objects.deleteDataObject(access_token, project_template_uuid);
};

/**
 * @async
 * @description This function will create a project object (project_list).
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [title="Missing Project Title"] - title of project object
 * @param {string} [description="project description default"] - title of project object
 * @param {object} [project={} - json object defining project
 * @returns {Promise<object>} - Promise resolving to a project data object
 */
const createProjectObject = (
  access_token = "null access_token",
  userUUID = "null user uuid",
  title = "Missing Project Title",
  description = "project description default",
  project = {}
) => {
  return Objects.createUserDataObject(
    userUUID,
    access_token,
    title,
    "project",
    description,
    {
      project
    }
  );
};

/**
 * @async
 * @description This function will delete project list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [project_uuid="missing project uuid"] - project list UUID
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const deleteProjectObject = (
  access_token = "null access_token",
  project_uuid = "missing project uuid"
) => {
  return Objects.deleteDataObject(access_token, project_uuid);
};

/**
 * @async
 * @description This function will retrieve project list.
 * @param {string} [userUUID="null user uuid"] - user UUID
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [projectObjectUUID="null uuid" - project list UUID
 * @returns {Promise<object>} - Promise resolving to a project data object
 */
const getProjectObject = (
  access_token = "null access_token",
  projectObjectUUID = "null uuid"
) => {
  return Objects.getDataObject(
    access_token,
    projectObjectUUID,
    true
  );
};

/**
 * @async
 * @description This function will update project list.
 * @param {string} [userUUID="null user uuid"] - user UUID
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [uuid="missing_uuid"] - project list UUID
 * @param {object} [projectObject={}]
 * @returns {Promise<object>} - Promise resolving to a project data object
 */
const updateProjectObject = (
  access_token = "null access_token",
  uuid = "missing_uuid",
  projectObject = {}
) => {
  return Objects.updateDataObject(
    access_token,
    uuid,
    projectObject
  );
};

/**
 * @async
 * @description This function will add project to a project object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [projectObjectUUID="missing_uuid"] - project object UUID
 * @param {object} [project={}] - individual project
 * @returns {Promise<object>} - Promise resolving to a project data object
 */
const addProjectToProjectObject = (
  access_token = "null access_token",
  projectObjectUUID = "missing_uuid",
  project = {}
) => {
  const vProjects = validateProjects([project]);
  if (vProjects.status === 200) {
    return Objects.getDataObject(
      access_token,
      projectObjectUUID,
      true
    ).then(rData => {
      //console.log(rData)
      rData.content.projects = [].concat(rData.content.projects, vProjects.projects);
      return Objects.updateDataObject(
        access_token,
        projectObjectUUID,
        rData
      );
    });
  } else {
    return Promise.reject(vProjects);
  }
};

/**
 * @async
 * @description This function will update a project in a project object.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [projectObjectUUID="missing_uuid"] - project object UUID
 * @param {object} [project={}] - updated project object
 * @returns {Promise<object>} - Promise resolving to a project data object
 */
const updateProjectInProjectObject = (
  access_token = "null access_token",
  projectObjectUUID = "missing_uuid",
  project = {}
) => {
  const vProjects = validateProjects([project]);
  //console.log('----', vProjects)
  if (vProjects.status === 200) {
    return Objects.getDataObject(access_token, projectObjectUUID).then(
      rData => {
        rData.content.project = rData.content.project.filter(t => {
          return t.uuid !== vProjects.projects[0].uuid;
        });
        rData.content.project = [].concat(rData.content.project, vProjects.projects);
        return Objects.updateDataObject(
          access_token,
          projectObjectUUID,
          rData
        );
      }
    );
  } else {
    return Promise.reject(vProjects);
  }
};

module.exports = {
  addProjectToProjectObject,
  createProjectObject,
  createProjectTemplate,
  deleteProjectObject,
  deleteProjectTemplate,
  getProjectObject,
  getProjectTemplates,
  updateProjectInProjectObject,
  updateProjectObject,
};