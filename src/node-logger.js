// instance
let _Logger;

module.exports = class Logger {
  constructor() {
    const Util = require("./utilities");
    // env booleans can come in as booleans or strings
    const prettyPrint =
      typeof Util.getGlobalThis().MS_LOGPRETTY !== "undefined" &&
      Util.getGlobalThis().MS_LOGPRETTY.toString().toLowerCase() === "true"
        ? true
        : false;
    
    //RFC5424
    const LEVELS = {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7,
    };

    const configuredLogLevel =
      Object.keys(LEVELS).indexOf(Util.getGlobalThis().MS_LOGLEVEL) !== -1
        ? Util.getGlobalThis().MS_LOGLEVEL
        : "info";
    // {
    //   "level": "debug",
    //   "message": "speak by POST request received",
    //   "application": "WSG",
    //   "timestamp": "2021-10-20T15:57:30.599Z",
    //   "metadata": {
    //     "debug": false,
    //     "level": "debug"
    //   },
    //   "id": "1030984a-f79c-4ceb-bda7-0233c7e2604d",
    //   "trace": "40a993f6-bfdc-4e7e-a184-8917c3430296"
    // }
    this.logger = {
      log: (level, message, meta) => {
        const validatedLevel =
          Object.keys(LEVELS).indexOf(level) !== -1 ? level : "info";
        const formattedLog = {
          level: validatedLevel,
          message: message,
          application: "s2sMsSDK",
          timestamp: new Date(Date.now()).toISOString(),
          metadata: meta,
        };

        // move these to the root of the object so make searches easier
        ["id", "parent", "trace"].forEach(prop => {
          if(typeof meta[prop] === "string"){
            formattedLog[prop] = meta[prop];
            delete meta[prop];
          }
        });

        doLog(LEVELS, configuredLogLevel, formattedLog, prettyPrint);

        function doLog(levels, configuredLevel, log, prettyPrint) {
          const configuredInt = levels[configuredLevel];
          const levelInt = levels[log.level];
          if (configuredInt >= levelInt) {
            let consoleMethod = "error";
            switch (levelInt) {
              case 7:
              case 6:
                consoleMethod = "log";
                break;
              case 5:
              case 4:
                consoleMethod = "warn";
                break;
            }

            try {
              console[consoleMethod](
                JSON.stringify(log, undefined, prettyPrint ? "  " : undefined)
              );
            } catch (e) {
              console.error(
                "unable to format log message: ",
                Util.formatError(e)
              );
            }
          }
        }
      },
    };
    return this;
  }

  //This function takes in an arguments object. It will serperatie out the first argument given. The first argument provided is the message title.
  getMessage(a) {
    return a && a.length > 0 ? a[0] : "default message";
  }

  //This function takes in an arguments object.
  //It will use these arguments to determine what the metadata is.
  getMeta(a) {
    let meta;
    //If there is only 1 argument that mean no metadata was passed in.

    if (a && a.length > 1) {
      //this code will run the splice and reduce functions on the arguments object as if it was an array
      //This code will add a new attribute to an empty object. This attribute will have the index of the argument as its' key.
      meta = [].slice.call(a, 1).reduce((p, c, i) => {
        if (typeof c === "object") {
          p = { ...p, ...c };
        } else {
          p[i] = c;
        }

        return p;
      }, {});
    }
    return meta;
  }

  emerg() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("emerg", msg, meta);
  }

  alert() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("alert", msg, meta);
  }

  crit() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("crit", msg, meta);
  }

  error() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("error", msg, meta);
  }

  warning() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("warning", msg, meta);
  }

  notice() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("notice", msg, meta);
  }

  info() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("info", msg, meta);
  }

  debug() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);

    this.log("debug", msg, meta);
  }

  log(aLevel, aMsg, aMeta) {
    let newLevel = aLevel;
    let newMeta = aMeta ? aMeta : {};
    newMeta.level = aLevel;
    //If the meta data has the property debug set as true the level of the log will be changed to debug
    if (aMeta && aMeta.hasOwnProperty("debug") && aMeta.debug === true) {
      newLevel = "alert";
    }
    this.logger.log(newLevel, aMsg, { meta: aMeta });
  }

  static getInstance() {
    if (!_Logger) {
      _Logger = new Logger();
    }
    return _Logger;
  }
};
