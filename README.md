Micro Service SDK
=================

Installation
------------

```bash
npm install star2star-js-ms-sdk --save
```

Usage
-----

```javascript
import s2sMS from 'star2star-js-ms-sdk';

s2s.Identity.getIdentity(creds.CPAAS_KEY, creds.email, creds.password).then((data)=>{
  //ok got data do something cool here
}).catch((error)=>{
  // houston we have an issue
})
```

Changes
-------

-	1.0.19 - added chat ms
-	1.0.18 - missing auth and short files
-	1.0.17 - shorturls, auth
-	1.0.16 - added groups
-	1.0.15 - event changing type
-	1.0.13 - updated readme
-	1.0,12 - spread operator issues
-	1.0.11 - config.json added
-	1.0.10 - getObjectByTypeName
-	1.0.7 - added refresh token
-	1.0.6 - added short urls to config
-	1.0.5 - Minor change to Event
-	1.0.4 - Minor change to Event
