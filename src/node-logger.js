const winston = require('winston');
export default class Logger {
  constructor(){ 
    this.logger = new (winston.Logger)({
      levels: {
          error: 0,
          trace: 1,
          info: 2,
          debug: 3
        },
      transports: [
        new (winston.transports.Console)({
          level: 'trace',
          formatter: function (options) {
            let loggerID;
            let loggerTrace;
            let loggerParent;
            let loggedMessageJSON={};

            if(options.meta && options.meta.hasOwnProperty('id')){
              loggerID = options.meta.id;
              delete options.meta.id;
            }

            if(options.meta && options.meta.hasOwnProperty('trace')){
              loggerTrace = options.meta.trace;
              delete options.meta.trace;
            }

            if(options.meta && options.meta.hasOwnProperty('parent')){
              loggerParent = options.meta.parent;
              delete options.meta.parent;
            }

            //stipping bearer tokens from logs for security
            if(options.meta && options.meta.hasOwnProperty("Authorization")) {
              delete options.meta.Authorization;
            }

            loggedMessageJSON.level=options.level;
            loggedMessageJSON.message = options.message;
            loggedMessageJSON.application = "s2sMsSDK";
            loggedMessageJSON.timestamp = new Date(Date.now()).toISOString();

            if (options.meta && JSON.stringify(options.meta) !== '{}'){
             loggedMessageJSON.metadata = options.meta;
            }

            if (loggerID){
             loggedMessageJSON.id=loggerID;
            }
            if (loggerTrace){
             loggedMessageJSON.trace=loggerTrace;
            }
            if (loggerParent){
             loggedMessageJSON.parent=loggerParent;
            }
         
            if(this.prettyPrint){
              return JSON.stringify(loggedMessageJSON, null, "\t");
            } else {
              return JSON.stringify(loggedMessageJSON);
            }
          }
        })
      ]
    });
    return this;
  }

  setLevel(aLevel){
    let validatedLevel;
    switch(aLevel){
      case "error":
      case "info":
      case "debug":
      case "trace":
        validatedLevel = aLevel;
        break;
      default:
        validatedLevel = "silent";
    }
    this.logger.transports.console.level = validatedLevel;
  }

  setPretty(pretty){
    if(pretty){
      this.logger.transports.console.prettyPrint = true;
    } else {
      this.logger.transports.console.prettyPrint = false;
    }
  }

  //This function takes in an arguments object. It will serperatie out the first argument given. The first argument provided is the message title.
  getMessage(a){
    return  (a && a.length > 0 ?  a[0] : "default message");
  }

  //This function takes in an arguments object.
  //It will use these arguments to determine what the metadata is.
  getMeta(a){
    let meta;
    //If there is only 1 argument that mean no metadata was passed in.

    if (a && a.length > 1){
      //this code will run the splice and reduce functions on the arguments object as if it was an array
      //This code will add a new attribute to an empty object. This attribute will have the index of the argument as its' key.
      meta = [].slice.call(a, 1).reduce((p,c, i)=>{
        if (typeof(c) === 'object'){
          p = { ...p, ...c}
        } else {
          p[i] = c;
        }

        return p;
      }, {});
    }
    return meta;
  }

  error() {
    const msg = this.getMessage(arguments)
    const meta = this.getMeta(arguments);

    this.log('error', msg, meta );
  }

  info(){
    const msg = this.getMessage(arguments)
    const meta = this.getMeta(arguments);

    this.log('info', msg, meta );
  }
  debug(){

    const msg = this.getMessage(arguments)
    const meta = this.getMeta(arguments);

    this.log('debug', msg, meta );
  }

  trace(){
    const msg = this.getMessage(arguments)
    const meta = this.getMeta(arguments);

    this.log('trace', msg, meta );
  }

  log(aLevel, aMsg, aMeta){
    let newLevel = aLevel;
    let newMeta = aMeta ? aMeta : {} ;
    newMeta.level = aLevel;
    //If the maeta data has the property debug set as true the level of the log will be changed to trace
    if (aMeta && aMeta.hasOwnProperty('debug') && aMeta.debug === true ){
      newLevel = 'trace';
    }
    this.logger.log(newLevel, aMsg, newMeta)
  }

}
