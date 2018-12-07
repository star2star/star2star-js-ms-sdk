/* global require module*/
"use strict";
const Util = require("./utilities");
const Auth = require("./auth");
const Groups = require("./groups");
const env = Util.config.env;
const roles = Util.config.roles[env];
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
 * @param {string} [type=undefined] - resource type, object, etc.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to an object containing a status message
 */
const createResourceGroups = async (
  accessToken = "null access token",
  accountUUID = "null accountUUID",
  resourceUUID = "null resourceUUID",
  type = undefined,
  users = {},
  trace = {}
) => {
  try {
    if (!type) {
      return Promise.reject(
        {
          "statusCode": 400,
          "message": "Unable to create resource groups. Resource type not defined."
        }
      );
    }
    //create the groups
    let nextTrace = objectMerge({}, trace);
    const groupPromises = [];
    const scopePromises = [];
    const groupTypeRegex = /^[r,u,d]{1,3}/;
    Object.keys(users).forEach(prop => {
      const userGroup = {
        name: `${prop}: ${resourceUUID}`,
        users: [...users[prop]],
        description: "resource group"
      };
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      groupPromises.push(Auth.createUserGroup(
        accessToken,
        accountUUID,
        userGroup,
        nextTrace
      ));
    });

    const groups = await Promise.all(groupPromises);

    logger.info(`Created resource groups: ${JSON.stringify(groups, null, "\t")}`);
    await new Promise(resolve => setTimeout(resolve, msDelay)); //microservices delay :(
    
    // scope the resource to the groups
    groups.forEach(group => {
      //extract the group type from the group name
      const groupType = groupTypeRegex.exec(group.name);
      nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      scopePromises.push(Auth.assignScopedRoleToUserGroup(
        accessToken,
        group.uuid,
        roles[type][groupType],
        "resource",
        [resourceUUID],
        nextTrace
      ));  
    }); 
    const scopes = await Promise.all(scopePromises);
    logger.info(
      `Completed resource group scoping calls: ${JSON.stringify(
        scopes,
        null,
        "\t"
      )}`
    );  
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
    logger.info(`Found resource groups to clean up: ${JSON.stringify(resourceGroups, null, "\t")}`);
    if (
      resourceGroups.hasOwnProperty("items") &&
      resourceGroups.items.length > 0
    ) {
      
      let nextTrace = objectMerge({}, trace);
      const groupsToDelete = [];
      resourceGroups.items.forEach(group => {
        groupsToDelete.push(
          Groups.deleteGroup(
            accessToken,
            group.user_group.uuid,
            nextTrace
          )
        );
        nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
      });
      await Promise.all(groupsToDelete);
      Promise.resolve({"status":"ok"});
    }
  } catch (error) {
    return Promise.reject(
      {
        "status": "failed",
        "cleanUpResourceGroups": error
      }
    );
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
  type = undefined,
  users = {},
  trace = {}
) => {
  try {
    if (!type) {
      return Promise.reject(
        {
          "statusCode": 400,
          "message": "Unable to update resource groups. Resource type not defined."
        }
      );
    }
    let nextTrace = objectMerge({}, trace);
    const resourceGroups = await Auth.listAccessByGroups(
      accessToken,
      resourceUUID,
      nextTrace
    );
    logger.info(`Resource group lookup success for ${resourceUUID}: ${JSON.stringify(resourceGroups, null, "\t")}`);
    if (
      resourceGroups.hasOwnProperty("items") &&
      resourceGroups.items.length > 0
    ) {
      //extract the type of group from the name
      const groupTypeRegex = /^[r,u,d]{1,3}/;
      const updatePromises = [];
      const deletePromises = [];
      resourceGroups.items.forEach(item => {
        logger.debug(`resource group item: ${JSON.stringify(item, null, "\t")}`);
        if (
          item.hasOwnProperty("user_group") &&
          item.user_group.hasOwnProperty("group_name")
        ) {
          const groupType = groupTypeRegex.exec(
            item.user_group.group_name
          );
          // A resource group exists for this set of permissions.
          if (typeof users === "object" && users.hasOwnProperty(groupType)) {
            nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
            updatePromises.push(
              Groups.getGroup(
                accessToken,
                item.user_group.uuid,
                {
                  expand: "members",
                  members_limit: 999 //hopefully we don't need pagination here. nh TODO call util.aggregate?
                },
                nextTrace
              )
            );
            
          } else {
            // we no longer have any users for this resource group, so delete it
            deletePromises.push(
              Groups.deleteGroup(
                accessToken,
                item.user_group.uuid
              )
            );  
          }
        } else {
          // Unexpected item format. Bail out....
          return Promise.reject({
            statusCode: 400,
            message: "resource group lookup returned corrupt data"
          });
        }
      });
      logger.debug(`updatePromises: ${JSON.stringify(updatePromises, null, "\t")}`);
      const userGroups = await Promise.all(updatePromises);
      logger.info(`user_groups with members lookup success: ${JSON.stringify(userGroups, null, "\t")}`);
      // update the groups' members
      const memberUpdatePromises = [];
      userGroups.forEach(group => {
        //add the new users to the group
        const groupType = groupTypeRegex.exec(
          group.name
        );
        logger.debug(`groupType for updating members: ${JSON.stringify(groupType, null, "\t")}`);
        const addUsers = users[groupType]
          .filter(user => {
            let found = false;
            group.members.items.forEach(groupUser => {
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
          nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
          memberUpdatePromises.push(
            Groups.addMembersToGroup(
              accessToken,
              group.uuid,
              addUsers,
              nextTrace
            )
          );
        }
        //delete the old users from the group
        const deleteUsers = group.members.items
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
          nextTrace = objectMerge({}, nextTrace, Util.generateNewMetaData(nextTrace));
          memberUpdatePromises.push(
            Groups.deleteGroupMembers(
              accessToken,
              group.uuid,
              deleteUsers,
              nextTrace
            )
          );
        }
        // remove the group type property from the users object
        // any remaining are for new groups which will be created below
        delete users[groupType];
      });
      logger.debug(`memberUpdatePromises: ${JSON.stringify(memberUpdatePromises, null, "\t")}`);
      await Promise.all(memberUpdatePromises);
      logger.debug(`deletePromises: ${JSON.stringify(deletePromises, null, "\t")}`);
      await Promise.all(deletePromises);       
    }

    // add any new groups if needed
    // the properties for the groups that were updated or deleted were removed from users object above
    if (Object.keys(users).length > 0) {
      nextTrace = objectMerge(
        {},
        nextTrace,
        Util.generateNewMetaData(nextTrace)
      );
      logger.info(`Creating New Resource Groups For Resource ${resourceUUID}: ${JSON.stringify(users, null, "\t")}`);
      await createResourceGroups(
        accessToken,
        accountUUID,
        resourceUUID,
        "object", //system role type
        users,
        trace
      );
    }
    return Promise.resolve({"status":"ok"});
  } catch (error) {
    return Promise.reject(
      {
        "status": "failed",
        "updateResourceGroups": error
      }
    );
  }
};



module.exports = {
  createResourceGroups,
  cleanUpResourceGroups,
  updateResourceGroups
};
