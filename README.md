# Micro Service SDK

## Installation

```bash
npm install star2star-js-ms-sdk --save
```

## Usage

```javascript
import s2sMS from "star2star-js-ms-sdk";

//To receive your CPAAS_OAUTH_TOKEN, username and password, please register here:
// https://star2star-communications.cloud.tyk.io/portal/register/

// These are the endpoint for development
s2sMS.setMsHost("https://cpaas.star2starglobal.net");
s2sMS.setMSVersion("v1");
s2sMS.setMsAuthHost("https://auth.star2starglobal.net");

s2sMS.Oauth.getAccessToken(
  creds.CPAAS_OAUTH_TOKEN,
  email,
  password
).then(data => {
    //ok got data do something cool here
  })
  .catch(error => {
    // houston we have an issue
  });
```

You can specify the log level and pretty print using environment variables. This works for node and browsers.
This needs to be specified prior to using the logger service since these are set when first instantiated.

```javascript
s2sMS.Util.getGlobalThis().MS_LOGLEVEL = "info" // emerg, alert, crit, error, warning, notice, debug
s2sMS.Util.getGlobalThis().MS_LOGPRETTY = true // defaults to false
```


## Methods

[Please click here for our documentation pages.](https://star2star.github.io/star2star-js-ms-sdk/ "Star2Star Micro Service SDK Documentation")