/* global require module*/
"use strict";

const Util = require("./utilities");

const Auth = require("./auth");

const Groups = require("./groups");

const env = Util.config.env;
const roles = Util.config.roles[env];

const objectMerge = require("object-merge");

const logger = Util.getLogger();
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

const createResourceGroups = async function createResourceGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
  let resourceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null resourceUUID";
  let type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    logger.debug("Creating Resource Group ".concat(resourceUUID, ". Users Object:"), users);

    if (!type) {
      return Promise.reject({
        "statusCode": 400,
        "message": "Unable to create resource groups. Resource type not defined."
      });
    } //create the groups


    let nextTrace = objectMerge({}, trace);
    const groupPromises = [];
    const scopePromises = [];
    const groupTypeRegex = /^[r,u,d]{1,3}/;
    Object.keys(users).forEach(prop => {
      const userGroup = {
        name: "".concat(prop, ": ").concat(resourceUUID),
        users: [...users[prop]],
        description: "resource group"
      };
      logger.debug("Creating Resource Group. User-Group:", userGroup);
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      groupPromises.push(Auth.createUserGroup(accessToken, accountUUID, userGroup, nextTrace));
    });
    const groups = await Promise.all(groupPromises);
    logger.debug("Creating Resource Group, Created User Groups:", groups); // scope the resource to the groups

    groups.forEach(group => {
      //extract the group type from the group name
      const groupType = groupTypeRegex.exec(group.name);
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      scopePromises.push(Auth.assignScopedRoleToUserGroup(accessToken, group.uuid, roles[type][groupType], "resource", [resourceUUID], nextTrace));
      logger.debug("Creating Resource Group. Scope Params:", "group.uuid: ".concat(group.uuid), "roles[type][groupType]: ".concat(roles[type][groupType]), "[resourceUUID]: [".concat(resourceUUID, "]"));
    });
    await Promise.all(scopePromises);
    logger.debug("Creating Resource Group Success");
    return Promise.resolve({
      status: "ok"
    });
  } catch (error) {
    logger.debug("Creating Resource Group Failed", error);
    return Promise.reject({
      status: "failed",
      createResourceGroups: error
    });
  }
};
/**
 * @async
 * @description This function will remove any permissions groups associated with a resource.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [resourceUUID="null resourceUUID"] - uuid of resource
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to a status message.
 */


const cleanUpResourceGroups = async function cleanUpResourceGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null resourceUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    logger.debug("Cleaning up Resource Groups For ".concat(resourceUUID));
    const resourceGroups = await Auth.listAccessByGroups(accessToken, resourceUUID, trace);
    logger.debug("Cleaning up Resource Groups", resourceGroups);

    if (resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0) {
      let nextTrace = objectMerge({}, trace);
      const groupsToDelete = [];
      resourceGroups.items.forEach(group => {
        groupsToDelete.push(Groups.deleteGroup(accessToken, group.user_group.uuid, nextTrace));
        nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      });
      await Promise.all(groupsToDelete);
      logger.debug("Cleaning up Resource Groups Successful");
      Promise.resolve({
        "status": "ok"
      });
    }
  } catch (error) {
    logger.debug("Cleaning up Resource Groups Failed", error);
    return Promise.reject({
      "status": "failed",
      "cleanUpResourceGroups": error
    });
  }
};
/**
 * @async
 * @description This function will update a resources permissions groups.
 * @param {string} [accessToken="null accessToken"] - Access Token
 * @param {string} [data_uuid="uuid not specified"] - data object UUID
 * @param {object} [users={}}] - users object treated as PUT
 * @param {object} [trace = {}] - microservice lifecycle trace headers
 * @returns {Promise<object>} Promise resolving to confirmation of updated groups
 */


const updateResourceGroups = async function updateResourceGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let resourceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "uuid not specified";
  let accountUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null accountUUID";
  let type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let users = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    if (!type) {
      return Promise.reject({
        "statusCode": 400,
        "message": "Unable to update resource groups. Resource type not defined."
      });
    }

    logger.debug("Updating Resource Groups For ".concat(resourceUUID));
    let nextTrace = objectMerge({}, trace);
    const resourceGroups = await Auth.listAccessByGroups(accessToken, resourceUUID, nextTrace);
    logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Groups Found"), resourceGroups);

    if (resourceGroups.hasOwnProperty("items") && resourceGroups.items.length > 0) {
      //extract the type of group from the name
      const groupTypeRegex = /^[r,u,d]{1,3}/;
      const updatePromises = [];
      const deletePromises = [];
      resourceGroups.items.forEach(item => {
        if (item.hasOwnProperty("user_group") && item.user_group.hasOwnProperty("group_name")) {
          const groupType = groupTypeRegex.exec(item.user_group.group_name);
          logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Group Type"), groupType); // A resource group exists for this set of permissions.

          if (typeof users === "object" && users.hasOwnProperty(groupType) && users[groupType].length > 0) {
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
          return Promise.reject({
            statusCode: 400,
            message: "resource group lookup returned corrupt data"
          });
        }
      });
      const userGroups = await Promise.all(updatePromises); // update the groups' members

      const memberUpdatePromises = [];
      userGroups.forEach(group => {
        //add the new users to the group
        const groupType = groupTypeRegex.exec(group.name);
        const addUsers = users[groupType].filter(user => {
          let found = false;
          group.members.items.forEach(groupUser => {
            if (!found) {
              user === groupUser.uuid ? found = true : found = false;
            }
          });
          return !found;
        }).map(user => {
          return {
            uuid: user,
            type: "user"
          };
        });

        if (addUsers && addUsers.length > 0) {
          nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
          memberUpdatePromises.push(Groups.addMembersToGroup(accessToken, group.uuid, addUsers, nextTrace));
        } //delete the old users from the group


        const deleteUsers = group.members.items.filter(groupUser => {
          let found = false;
          users[groupType].forEach(user => {
            if (!found) {
              user === groupUser.uuid ? found = true : found = false;
            }
          });
          return !found;
        }).map(groupUser => {
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
      await Promise.all(memberUpdatePromises);
      await Promise.all(deletePromises);
    } // add any new groups if needed
    // the properties for the groups that were updated or deleted were removed from users object above


    if (Object.keys(users).length > 0) {
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      logger.debug("Updating Resource Groups For ".concat(resourceUUID, ": Creating New Groups"), users);
      await createResourceGroups(accessToken, accountUUID, resourceUUID, "object", //system role type
      users, trace);
    }

    return Promise.resolve({
      "status": "ok"
    });
  } catch (error) {
    logger.debug("Updating Resource Groups For ".concat(resourceUUID, " Failed"), error);
    return Promise.reject({
      "status": "failed",
      "updateResourceGroups": error
    });
  }
};

module.exports = {
  createResourceGroups,
  cleanUpResourceGroups,
  updateResourceGroups
};