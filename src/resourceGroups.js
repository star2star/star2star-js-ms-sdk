/* global require module*/
"use strict";
const Util = require("./utilities");
const Auth = require("./auth");
const Groups = require("./groups");
const roles = Util.config.objectRoles;
const msDelay = Util.config.msDelay;
const objectMerge = require("object-merge");
const logger = Util.logger;

/**
 * @async
 * @description This function will create the permissions group for a resource uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null accountUUID"] - account to associate resource group to
 * @param {string} [resourceUUID="null resourceUUID"] - resource requiring permissions groups
 * @param {object} [users={}] - Read, Update, Delete users object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to an object containing a status message
 */
const createResourceGroups = async (
  accessToken = "null access token",
  accountUUID = "null accountUUID",
  resourceUUID = "null resourceUUID",
  users = {},
  trace = {}
) => {
  try {
    //create the groups
    let nextTrace = objectMerge({}, trace);
    for (const prop in users) {
      if (roles.hasOwnProperty(prop)) {
        const userGroup = {
          name: `${prop}: ${resourceUUID}`,
          users: [...users[prop]],
          description: "resource group"
        };
        nextTrace = objectMerge(
          {},
          nextTrace,
          Util.generateNewMetaData(nextTrace)
        );
        const group = await Auth.createUserGroup(
          accessToken,
          accountUUID,
          userGroup,
          nextTrace
        );
        logger.info(
          `Created resource group: ${JSON.stringify(group, null, "\t")}`
        );
        await new Promise(resolve => setTimeout(resolve, msDelay)); //microservices delay :(
        nextTrace = objectMerge(
          {},
          nextTrace,
          Util.generateNewMetaData(nextTrace)
        );
        await Auth.assignScopedRoleToUserGroup(
          accessToken,
          group.uuid,
          roles[prop],
          resourceUUID,
          nextTrace
        );
      }
    }
    return Promise.resolve({ status: "ok" });
  } catch (error) {
    return Promise.reject({ status: "failed", createResourceGroups: error });
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
const cleanUpResourceGroups = async (
  accessToken = "null accessToken",
  resourceUUID = "null resourceUUID",
  trace = {}
) => {
  try {
    const resourceGroups = await Auth.listAccessByGroups(
      accessToken,
      resourceUUID,
      trace
    );
    logger.info(
      `Found resource groups to clean up: ${JSON.stringify(
        resourceGroups,
        null,
        "\t"
      )}`
    );
    if (
      resourceGroups.hasOwnProperty("items") &&
      resourceGroups.items.length > 0
    ) {
      let nextTrace = objectMerge({}, trace);
      for (const item in resourceGroups.items) {
        nextTrace = objectMerge(
          {},
          nextTrace,
          Util.generateNewMetaData(nextTrace)
        );
        await Groups.deleteGroup(
          accessToken,
          resourceGroups.items[item].user_group.uuid,
          nextTrace
        );
      }
    }
  } catch (error) {
    return Promise.reject(error);
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
const updateResourceGroups = async (
  accessToken = "null accessToken",
  resourceUUID = "uuid not specified",
  accountUUID = "null accountUUID",
  users = {},
  trace = {}
) => {
  try {
    const resourceGroups = await Auth.listAccessByGroups(
      accessToken,
      resourceUUID,
      trace
    );
    let nextTrace = trace;
    logger.info(
      `Resource group lookup success: ${JSON.stringify(
        resourceGroups,
        null,
        "\t"
      )}`
    );
    if (
      resourceGroups.hasOwnProperty("items") &&
      resourceGroups.items.length > 0
    ) {
      //extract the type of group from the name
      const groupTypeRegex = /^[r,u,d]{1,3}/;
      for (const item in resourceGroups.items) {
        logger.info(
          `resource group item: ${JSON.stringify(
            resourceGroups.items[item],
            null,
            "\t"
          )}`
        );
        if (
          resourceGroups.items[item].hasOwnProperty("user_group") &&
          resourceGroups.items[item].user_group.hasOwnProperty("group_name")
        ) {
          let groupType = groupTypeRegex.exec(
            resourceGroups.items[item].user_group.group_name
          );
          // A resource group exists for this set of permissions.
          if (typeof users === "object" && users.hasOwnProperty(groupType)) {
            nextTrace = objectMerge(
              {},
              nextTrace,
              Util.generateNewMetaData(nextTrace)
            );
            const userGroup = await Groups.getGroup(
              accessToken,
              resourceGroups.items[item].user_group.uuid,
              {
                expand: "members",
                members_limit: 999 //hopefully we don't need pagination here. nh
              },
              nextTrace
            );
            logger.info(
              `Found Existing Resource Group To Update: ${JSON.stringify(
                userGroup,
                null,
                "\t"
              )}`
            );
            //add the new users to the group
            const addUsers = users[groupType]
              .filter(user => {
                let found = false;
                userGroup.members.items.forEach(groupUser => {
                  if (!found) {
                    user === groupUser.uuid ? (found = true) : (found = false);
                  }
                });
                return !found;
              })
              .map(user => {
                return { uuid: user, type: "user" };
              });
            if (addUsers && addUsers.length > 0) {
              nextTrace = objectMerge(
                {},
                nextTrace,
                Util.generateNewMetaData(nextTrace)
              );
              await Groups.addMembersToGroup(
                accessToken,
                userGroup.uuid,
                addUsers,
                nextTrace
              );
            }
            //delete the old users from the group
            const deleteUsers = userGroup.members.items
              .filter(groupUser => {
                let found = false;
                users[groupType].forEach(user => {
                  if (!found) {
                    user === groupUser.uuid ? (found = true) : (found = false);
                  }
                });
                return !found;
              })
              .map(groupUser => {
                return { uuid: groupUser.uuid };
              });
            if (deleteUsers && deleteUsers.length > 0) {
              nextTrace = objectMerge(
                {},
                nextTrace,
                Util.generateNewMetaData(nextTrace)
              );
              await Groups.deleteGroupMembers(
                accessToken,
                userGroup.uuid,
                deleteUsers,
                nextTrace
              );
            }
            //mark the users object as done for this groupType
            users[groupType] = "";
          } else {
            // we no longer have any users for this resource group, so delete it
            await Groups.deleteGroup(
              accessToken,
              resourceGroups.items[item].user_group.uuid
            );
            users[groupType] = "";
            logger.info(
              `Deleted Resource Group: ${
                resourceGroups.items[item].user_group.group_name
              }`
            );
          }
        } else {
          // Unexpected item format. Bail out....
          return Promise.reject({
            statusCode: 400,
            message: "resource group lookup returned corrupt data"
          });
        }
      }
    }
    // add any new groups if needed. empty properties were set above
    for (const user in users) {
      if (users[user] === "") {
        delete users[user];
      }
    }
    if (Object.keys(users).length > 0) {
      nextTrace = objectMerge(
        {},
        nextTrace,
        Util.generateNewMetaData(nextTrace)
      );
      logger.info(
        `Creating New Resource Groups For Updated Object ${JSON.stringify(
          users,
          null,
          "\t"
        )}`
      );
      await createResourceGroups(
        accessToken,
        accountUUID,
        resourceUUID,
        users,
        trace
      );
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  createResourceGroups,
  cleanUpResourceGroups,
  updateResourceGroups
};
