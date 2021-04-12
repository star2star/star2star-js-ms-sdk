#!/bin/bash

if [ -n "$1" ]; then
echo "This script requires no arguments.
It will log you into the correct registry, build and publish the package.

It requires a file called \"creds.sh\" with the following contents with the same folder.

#!/bin/bash

USERNAME=\"some_username\"
PASSWORD=\"some_password\"
EMAIL=\"someone@star2star.com\"

This file is not included in revision control, and should not be committed."
exit 0
fi

#TODO pass in code and add case if needed
fail () {
    echo "No Credential File Found"
    exit 1
}

. creds.sh || fail
REGISTRY="registry.npmjs.org"
REGISTRY_URL="https://${REGISTRY}"

#Supress npm messages while we log in
LOGLEVEL=$(npm config get loglevel)
npm config set loglevel="silent"

#Ensure we are not logged into the wrong registry
npm logout

#Run the login POST
RESPONSE=$(curl  -H "Accept: application/json" \
-H "Content-Type:application/json" \
-X PUT \
--data "{\"name\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" \
--user ${USERNAME}:${PASSWORD} ${REGISTRY_URL}/-/user/org.couchdb.user:${USERNAME}) 

#Extract the auth token
TOKEN=$(echo $RESPONSE | egrep -o '[a-z,A-Z,0-9,=,\-]+\"}$' | egrep -o '[a-z,A-Z,0-9,=,-]+')

npm set registry ${REGISTRY_URL}

#Add the token to bind session
npm set //${REGISTRY}/:_authToken $TOKEN

#return log level to normal for the build and publish
npm config set loglevel=${LOGLEVEL}

# npm run clean && npm run build && npm run doc && npm publish
npm publish









