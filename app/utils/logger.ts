import * as amplitude from '@amplitude/analytics-node';


export class Logger {
    constructor() {
        amplitude.init('4f8e40b8d66df33da1d374ba52ef87dc', {
            logLevel: amplitude.Types.LogLevel.Debug,
          });
    }

    logMessage = (message) => {
        console.log('message:', message)
        amplitude.logEvent(message);
    }

    trackMessage = (message, user) => {
        amplitude.track(message, undefined, {
            user_id:user,
          });
    }
}
   