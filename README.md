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

### Identity Microservice

### **createIdentity** - creates a new user
    
- #### **Parameters**:

  - Identity API Key: Provisioned key for organization to access Identity microservice   
  - email: Email address of the new user
  - identity_type_name: String with value 'guest'. TODO when is 'user' value valid?
  - password: password string that user will use to authenticate to microservices.  Currently no rules for length/content TODO - will there be password rules?

- #### **Returns**:
  
    A javascript promise that resolves into a create identity response object

- #### **Usage**:

    s2sMS.Identity.createIdentity()


### **deleteIdentity** - Deletes the user object matching the user_uuid submitted 

- #### **Parameters**:
  - Identity API Key: Provisioned key for organization to access Identity microservice   
  - userUuid: uuid for user to be deleted

- #### **Returns**:
    A javascript promise that resolves to a response status of 204

- #### **Usage**:
   s2sMS.Identity.deleteIdentity()


### **login** - calls the identity microservice with the credentials provided.  If credentials are valid, response will contain user_uuid and other user details.

- #### **Parameters**:
  - Identity API Key: Provisioned key for organization to access Identity microservice   
  - email: Email address of the user to login
  - password: password string for authenticating user 

- #### **Returns**:
  
    A javascript promise that resolves to identity user details

- #### **Usage**:

    s2sMS.Identity.login()


### **lookupIdentity** - Retrieves identity details for submitted email in items array.  If no match exists, items array will be empty.

- #### **Parameters**:
  - Identity API Key: Provisioned key for organization to access Identity microservice   
  - email: Email address of the user to lookup

- #### **Returns**:
  
    A javascript promise that resolves to identity user lookup details

- #### **Usage**:

    s2sMS.Identity.lookupIdentity()

###  **listAccounts** - retrieves list of accounts
- #### **Parameters**:
  - Identity API Key: Provisioned key for organization to access Identity microservice   

- #### **Returns**:
  
    A javascript promise that resolves to list of accounts

- #### **Usage**:

    s2sMS.Identity.listAccounts()


### **getAccount** - Retrieves account information for submitted accountUuid
- #### **Parameters**:
  - Identity API Key: Provisioned key for organization to access Identity microservice   
  - accountUuid: uuid for the requested account

- #### **Returns**:
  
    A javascript promise that resolves to object with requested account info

- #### **Usage**:

    s2sMS.Identity.getAccount()



## Changes

*2.0.10 - bug fix for shorturl having wrong endpoint
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
