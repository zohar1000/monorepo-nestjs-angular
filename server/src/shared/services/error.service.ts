import { Injectable } from '@nestjs/common';
import { Severity } from '../enums/severity.enum';
import { ZTime } from 'zshared';

@Injectable()
export class ErrorService {
  constructor() {
    this.initErrorHandling();
  }

  public loge(...params) { return this.log(Severity.Error,   ...params) }
  public logw(...params) { return this.log(Severity.Warning, ...params) }
  public logi(...params) { return this.log(Severity.Info,    ...params) }

  log(...params) {
    let errorEvent;
    let isAlreadyLogged = false;
    let dataCount = 0;
    const log: any = { severity: params.shift(), errorMsg: params.shift(), createTimeF: ZTime.utcUniDateTimeMs() };

    for (const param of params) {
      if (param instanceof Error) {
        errorEvent = param;
        if (errorEvent['isLogged']) {
          isAlreadyLogged = true;
          break;
        } else {
          errorEvent['isLogged'] = true;
          log['errorName'] = errorEvent.name;
          log['errorEventMsg'] = errorEvent.message;
        }
      } else {
        log.additionalData = log.additionalData || {};
        log.additionalData[`data${++dataCount}`] = param;
      }
    }


    if (!isAlreadyLogged) {
      log['stackTrace'] = this.getStackTrace(errorEvent, this.constructor.name);
      this.print2console(log);
      if (!errorEvent) {
        errorEvent = new Error(log.errorMsg);
        errorEvent.isLogged = true;
      }
    }

    return errorEvent;
  }

  print2console(logRequest) {
    const COLORS = {
      [Severity.Error]   : '\x1b[31m',
      [Severity.Warning] : '\x1b[35m',
      [Severity.Info]    : '\x1b[36m',
      default               : '\x1b[37m'  // white
    };

    console.log(COLORS[logRequest.severity], '\n' + ZTime.utcUniDateTimeMs() + ' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(`Create time: ${logRequest.createTimeF}`);
    console.log(`Severity: ${logRequest.severity}`);
    if (logRequest.errorMsg) console.log(`${logRequest.severity} Message: ${logRequest.errorMsg}`);
    if (logRequest.errorEventMsg) {
      console.log(`Error event message: ${logRequest.errorEventMsg}`);
    }
    if (logRequest.reqMethod) {
      console.log(`Request Method: ${logRequest.reqMethod}`);
      console.log(`Request URL: ${logRequest.reqUrl}`);
      if (logRequest.reqBody) console.log(`Request Body: ${JSON.stringify(logRequest.reqBody, null, 2)}`);
    }

    if (logRequest.additionalData) {
      console.log('Additional data:');
      // tslint:disable-next-line:forin
      for (const key in logRequest.additionalData) {
        let value = logRequest.additionalData[key];
        if (typeof value === 'object') {
          try {
            value = JSON.stringify(value, null, 2);
          } catch (e) {
            value = '*** THE VALUE COULD NOT BE PARSED, ERROR: ' + e.message + ' ***';
          }
        }
        console.log('  ' + value);
      }
    }
    console.log(`Stack trace:`);
    logRequest.stackTrace.forEach(line => console.log('  ' + line));
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    console.log(COLORS.default, '');
  }

  /******************************************/
  /*      E R R O R    H A N D L I N G      */
  /******************************************/


  initErrorHandling() {
    Error.stackTraceLimit = 30;

    process.on('uncaughtException', (err: Error) =>  {
      console.log('==> Global Error Handler ********************************************************');
      console.log('Uncaught system exception:', err);
      console.log('Stack trace:', this.getStackTrace(err));
      console.log('******************************************************************************************');
    });

    process.on('unhandledRejection', (reason: any, promise) => {
      console.log('==> Global Error Handler ********************************************************');
      console.log('Unhandled promise rejection, reason:', reason, ', promise:', promise);
      console.log('Stack trace:', this.getStackTrace(reason));
      console.log('******************************************************************************************');
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received');
      // Stops the server from accepting new connections and finishes existing connections.
      // this.close();
    });

    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        console.log('Closing all connections...');
        setTimeout(() => {
          console.log('Finished closing connections');
          process.exit(0);
        }, 1500);
      }
    });
  }

	async handleError(errorType, message) {
    if (typeof message !== 'string') {
      console.log('reason:', message);
      message = 'Unhandled Rejection';
    }
		console.error(`======= There was an ${errorType} =========`, message);
	}


  /***********************/
  /*      U T I L S      */
  /***********************/

  getStackTrace(error: Error, loggingServiceClassName = '') {
    let e = error;
    if (!e || !e.stack) e = new Error();
    if (typeof e.stack !== 'string') {
      return String(e.stack);
    } else {
      const lines =  e.stack
        .split('\n')
        .filter(line => !line.startsWith('Error'))
        .map(line => line.trim());
      if (loggingServiceClassName !== '') {
        loggingServiceClassName += '.';
        let i;
        for (i = lines.length - 1; i >= 0 && !lines[i].includes(loggingServiceClassName); i--) {}
        if (i >= 0) lines.splice(0, i + 1);
      }
      return lines;
    }
  }
}
