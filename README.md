# Micro Service SDK

## Installation

```bash
npm install star2star-js-ms-sdk --save
```

## Usage

```javascript
import Logger from "./node-logger"; s2sMS from "star2star-js-ms-sdk";

// Create a file that is not included in your revision control to contain your private data
// Here we are using "credentials.json"

const fs = require("fs");
// You can set defaults or credentials directly in a temporary file for testing. Do not commit this!
let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd"
};

if (fs.existsSync("./test/credentials.json")) {
  // do not need test folder here
  creds = require("./credentials.json");
}

// You need to set base Url if you want to specify another endpoint than production(https://cpaas.star2star.com/api) 

//To receive your CPAAS_OAUTH_TOKEN, username and password, please register here:
// https://star2star-communications.cloud.tyk.io/portal/register/

// This is the endpoint for development
s2sMS.setMsHost("https://cpaas.star2starglobal.net");
s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
s2sMS.setMsAuthHost("https://auth.star2starglobal.net");

s2sMS.Oauth.getAccessToken(
  creds.CPAAS_OAUTH_TOKEN,
  creds.email,
  creds.password
).then(data => {
    //ok got data do something cool here
  })
  .catch(error => {
    // houston we have an issue
  });
```
If you see the following error when using the SDK:
 
```javascript
ReferenceError: regeneratorRuntime is not defined
```
You need to require or import Logger from "./node-logger"; babel polyfill it at the top of the entry point to your application.
```javascript
require("babel-polyfill");
```

When running in node you can specify the log level and pretty print using environment variables

```javascript
process.env.MS_LOGLEVEL = "debug" //silent, trace, info, error
process.env.MS_LOGPRETTY = true // defaults to false
```
## Methods

[Please click here for our documentation pages.](https://star2star.github.io/star2star-js-ms-sdk/ "Star2Star Micro Service SDK Documentation")

## Changes\
* 3.5.6 - make version optional in delete workflow
* 3.5.5 - fix create form instance default params
* 3.5.4 - get form instance and create form instance
* 3.5.3 - add create oauth2 application custom resource group
* 3.5.2 - add type to default resource groups
* 3.5.1 - list user form submissions
* 3.5.0 - list entitlements products
* 3.4.3 - fix empty criteria
* 3.4.2 - wait for oauth2 client setup
* 3.4.1 - fix endpoint name
* 3.4.0 - add new applications auth endpoints
* 3.3.4 - add form ms - listUserForms 
* 3.3.3 - add query param to refresh token when requested part 3
* 3.3.2 - add query param to refresh token when requested part 2
* 3.3.1 - add query param to refresh token when requested
* 3.3.0 - add token support for provider connection uuids
* 3.2.53 - fix get provider token param nomenclature
* 3.2.52 - update get provider token to use policy instead of client id
* 3.2.51 - fix undefined criteria take 2
* 3.2.50 - fix undefined criteria
* 3.2.49 - add list provider connections
* 3.2.48 - fix offset in aggregate utility
* 3.2.47 - improved pending resource utility error logging
* 3.2.46 - add aggregate to workflow
* 3.2.45 - update pending resource utility x-status header
* 3.2.44 - update pending resource utility
* 3.2.43 - add device_id support for mobile notifications
* 3.2.42 - fix platform data push notifications optional param
* 3.2.41 - Throw error if no admin or user in account default group
* 3.2.40 - Adjust optional params for mobile notification
* 3.2.39 - Fix snooze filter on get conversations
* 3.2.38 - Fix push notification body prop name
* 3.2.37 - Updated createUUID 
* 3.2.36 - Push notifications fix and unit test stub
* 3.2.35 - Added snooze/un-snooze conversation 
* 3.2.34 - fix logger levels
* 3.2.33 - update logger
* 3.2.32 - added delete individual messages
* 3.2.31 - added sms pubsub workaround
* 3.2.30 - added offset and limit to list users channels
* 3.2.29 - added list users channels
* 3.2.28 - added send message to chat channel
* 3.2.27 - added push notifications support
* 3.2.26 - added custom pubsub
* 3.2.25 - added device id to oauth access token request 
* 3.2.24 - added separate method getWorkflowGroupFiltered for filtered list and roll back to getWorkflowGroup to support downward compatibility
* 3.2.23 - add guard for missing resource groups
* 3.2.22 - added group and provider methods 
* 3.2.21 - adjust send email content data structure
* 3.2.20 - workflow /history new end points for show_workflow_vars, show_incoming_data, show_transition_results
* 3.2.19 - retrieveMessages - sort parameter
* 3.2.18 - messaging - Added deleteConversation & deleteMultipleConversations methods
* 3.2.17 - URL parameters encrypt and decrypt methods
* 3.2.16 - "include" query param in getIdentity 
* 3.2.15 - error detail array set to strings
* 3.2.14 - fix workflowTemplate filter bug
* 3.2.13 - remove debug console.log
* 3.2.12 - fixed error parser for external sources that return strings for body
* 3.2.11 - updated error parser for external sources that return strings for body
* 3.2.10 - added metadata.js unit tests
* 3.2.9 - added metadata.js and getMetadataSubsystems method
* 3.2.8 - fix providers authorize
* 3.2.7 - add follow redirects to providers authorize
* 3.2.6 - fix providers authorize headers
* 3.2.5 - fix providers authorize client_id param
* 3.2.4 - add providers authorize
* 3.2.3 - fix missing providers reference in config
* 3.2.2 - add clientID to provider GET token
* 3.2.1 - add get token using provider microservice
* 3.2.0 - switch all calls over to use error formatter
* 3.1.9 - move remainder of groups to auth and add error formatter util
* 3.1.8 - move auto-generated user-groups GET to own method in auth
* 3.1.7 - add auto-generated user-groups to getAccount
* 3.1.6 - add update expiresTime to pubsub
* 3.1.5 - microservice hard limit work-around take 2
* 3.1.4 - microservice hard limit work-around
* 3.1.3 - unit test for workflow result array
* 3.1.2 - fix prettyPrint flag
* 3.1.1 - fix for debug flag
* 3.1.0 - winston 3.2 for logging
* 3.0.31 - add dynamic resource group roles lookup
* 3.0.30 - fix modify account response code
* 3.0.29 - logger pretty print fix due to env vars being strings
* 3.0.28 - add get contact by uuid
* 3.0.27 - fix typo
* 3.0.26 - point list tokens to cpaas
* 3.0.25 - more updates to contacts unit tests
* 3.0.24 - updates to contacts unit tests 
* 3.0.23 - updates to unit tests
* 3.0.22 - updates to babel for newer browser support
* 3.0.18 - babel changed and removed core-js as dependency
* 3.0.17 - fix bad build - added core-js to dev dependencies
* 3.0.16 - bad build 
* 3.0.15 - Fix bad build
* 3.0.14 - Test environment configurable 
* 3.0.13 - Add pagination to list user contacts
* 3.0.12 - Add additional properties query param to get identity
* 3.0.11 - Switch to HEAD for pending resource polling
* 3.0.10 - Simplify logging to use process.env and fix resourse group update bug
* 3.0.9 - Add empty group guarding for resource groups update
* 3.0.8 - Add get single role
* 3.0.7 - Use headers for polling utility
* 3.0.6 - Update async polling utility
* 3.0.5 - List Roles for a specific User
* 3.0.4 - Add modify identity properties
* 3.0.3 - Updates to contacts
* 3.0.2 - Fix documentation error
* 3.0.1 - Add get single identity
* 3.0.0 - Support for async Star2Star Microservices using polling.
* 2.2.36 - Get single subscription
* 2.2.35 - Fix bug in media service 
* 2.2.34 - Fix build bug
* 2.2.33 - Fix path bug and sendMessage content
* 2.2.32 - Update babel version and access token scope param
* 2.2.31 - Update access token scope
* 2.2.30 - Additional messaging methods
* 2.2.29 - Add more generic send message
* 2.2.28 - Add create conversation with meta
* 2.2.27 - Contacts issue ReferenceError - is not defined
* 2.2.26 - Updates to Contacts API support
* 2.2.25 - Don't need try-catch in several places.
* 2.2.24 - Async/Await Unit test updates for chat and scheduler
* 2.2.23 - Async/Await Unit test updates for accounts, auth, and objects.
* 2.2.22 - Reduced microservice delay work-around for outh repsonse time issue.
* 2.2.21 - Added microservice delay back as work-around for outh repsonse time.
* 2.2.20 - Remove microservice delay
* 2.2.19 - Add updated logger
* 2.2.18 - Updates to accounts and auth unit tests
* 2.2.17 - Performance improvements for resource groups
* 2.2.16 - Disable debug mode for browser compatiblilty
* 2.2.15 - Add scheduler metadata
* 2.2.14 - Add scheduler and modify user-group
* 2.2.13 - Object MS - bug in getByType
* 2.2.12 - Object MS - getByType - new for permissions implementation - global 
* 2.2.11 - Add identity lookup by account
* 2.2.10 - Improved fix for filter bug
* 2.2.9 - Add guard to fix filter bug and additional logging
* 2.2.8 - Clean up console.logs
* 2.2.7 - Update permissions to support revamped scoping
* 2.2.6 - Fix documentation
* 2.2.5 - Add client credentialing
* 2.2.4 - Fix winston version take 2
* 2.2.3 - Fix winston version
* 2.2.2 - Set dependency versions
* 2.2.1 - Fix resource groups
* 2.2.0 - Add trace and permissions resource groups
* 2.1.58 - Update create shortUrl
* 2.1.57 - Fix browser namespacing
* 2.1.56 - Add browser support
* 2.1.55 - Update simpleSMS unit test
* 2.1.54 - Add simple SMS
* 2.1.53 - Revert babel updates, they break documentation
* 2.1.52 - Updates to babel
* 2.1.51 - Updates to babel
* 2.1.50 - Updates to unit tests
* 2.1.49 - Add send email
* 2.1.48 - Add workflow groups support
* 2.1.47 - Add request aggregator utility and generic getObjects
* 2.1.46 - Temp fix for pagination
* 2.1.45 - Add pagination to object calls
* 2.1.44 - Remove demo code from get object calls
* 2.1.43 - Add resource group scoping.
* 2.1.42 - Unit test updates after permissions drop.
* 2.1.41 - Add list lambda take 2
* 2.1.40 - Add list lambda
* 2.1.39 - Re-add application object validation
* 2.1.38 - Splitting up application speaks, so disable validation - temporary
* 2.1.37 - First pass at workflow, more unit tests pending
* 2.1.36 - Re-add application object validation.
* 2.1.35 - Remove application object content validation - temporary.
* 2.1.34 - Fix method name to match convention.
* 2.1.33 - Move pagination and filter to utils.
* 2.1.32 - Add name sort order to list objects
* 2.1.31 - Add filter and pagination to list application
* 2.1.30 - Change project to application
* 2.1.29 - Update function names for standardization
* 2.1.28 - Auth and Project
* 2.1.27 - More updates to accounts and unit tests
* 2.1.26 - More updates to unit tests
* 2.1.25 - More updates to unit tests
* 2.1.24 - Fix identity unit tests and add delete account
* 2.1.23 - Add client auth.
* 2.1.22 - Fix Chat unit tests.
* 2.1.21 - Normalize add and delete group members and update unit tests.
* 2.1.20 - Add list group members
* 2.1.19 - Fix groups and add deativate/reactivate groups
* 2.1.18 - Add flexible filters
* 2.1.17 - Add User-Groups
* 2.1.16 - Update identities
* 2.1.15 - Add password reset
* 2.1.14 - Fix add subscriptions
* 2.1.13 - Update lookup identity
* 2.1.12 - Fix missing commit
* 2.1.11 - Simplify modify account
* 2.1.10 - Fix docs
* 2.1.9 - Suspend and reinstate accounts.
* 2.1.8 - Make account_type and expand optional
* 2.1.7 - Add create account, lmit and offset, and tweaks to unit tests
* 2.1.6 - add account list relationship endpoint.
* 2.1.5 - Add roles and relationships endpoints.
* 2.1.4 - Expose new Accounts API and updated auth
* 2.1.3 - Grouped and updated documentation
* 2.1.2 - Added account properties method
* 2.1.1 - improved payload object description
* 2.1.0 - Added documentationjs
* 2.0.10 - bug fix for shorturl having wrong endpoint
* 2.0.8 - ooops 
* 2.0.7 - bugs 
* 2.0.6 - added method to identity to get identity details
* 2.0.5 - bug in request missing json:true 
* 2.0.4 - Added media service - files 
* 2.0.3 - Adding new tests, and Contacts ms, removed unused params
* 2.0.2 - Move baseUrl to process.env.MS_HOST
* 2.0.1 - testing npm publishing
* 2.0.0 - Now must set baseUrl for microservices to get anything other than 'https://cpaas.star2star.com/api'

* 1.0.30 - fixed duplicate items
* 1.0.29 - duplicate items in getDataObjectByTypeAndName - resolved
* 1.0.28 - issue with object getDataObjectByTypeAndName - resolved and added test
* 1.0.27 - utilities - static variables - added YYYY, MM, DD & getDataObjectByTypeAndName look at both global and user
* 1.0.26 - event objects created as user objects instead of global objects
* 1.0.25 - removed uuid from the event content since it means nothing
* 1.0.24 - added getGlobalObjectsByType
* 1.0.23 - added filter to group list
* 1.0.22 - error in auth - explicit permissions
* 1.0.21 - error in auth - scope not defined
* 1.0.20 - adding missing chat calls
* 1.0.19 - added chat ms
* 1.0.18 - missing auth and short files
* 1.0.17 - shorturls, auth
* 1.0.16 - added groups
* 1.0.15 - event changing type
* 1.0.13 - updated readme
* 1.0,12 - spread operator issues
* 1.0.11 - config.json added
* 1.0.10 - getObjectByTypeName
* 1.0.7 - added refresh token
* 1.0.6 - added short urls to config
* 1.0.5 - Minor change to Event
* 1.0.4 - Minor change to Event
