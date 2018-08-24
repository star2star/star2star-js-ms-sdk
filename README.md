# Micro Service SDK

## Installation

```bash
npm install star2star-js-ms-sdk --save
```

## Usage

```javascript
import s2sMS from "star2star-js-ms-sdk";


// You need to set base Url if you want to specify another endpoint than production(https://cpaas.star2star.com/api) 

// This is the endpoint for development
s2sMS.setMsHost("https://cpaas.star2starglobal.net");

s2sMS.Identity.login(creds.CPAAS_KEY, creds.email, creds.password)
  .then(data => {
    //ok got data do something cool here
  })
  .catch(error => {
    // houston we have an issue
  });
```

## Methods

[Please click here for our documentation pages.](https://star2star.github.io/star2star-js-ms-sdk/ "Star2Star Micro Service SDK Documentation")

## Changes
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
