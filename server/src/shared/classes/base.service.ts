import { EventEmitter } from 'events';
import { ErrorService } from '../services/error.service';
import { FileService } from '../services/file.service';
import { SanitationService } from '../services/sanitation.service';
import { GlobalService } from '../services/global.service';
const mongodb = require('mongodb');

export abstract class BaseService extends EventEmitter {
  protected errorService: ErrorService;
  protected fileService: FileService;
  protected sanitationService: SanitationService;
  // protected mailService: MailService;

  protected constructor() {
    super();
    GlobalService.setGlobalServices(this);
  }

  logeAndThrow(...params) {
    const errorEvent = this.errorService.loge(...params);
    throw Error(errorEvent);
  }

  logwAndThrow(...params) {
    const errorEvent = this.errorService.logw(...params);
    throw Error(errorEvent);
  }

  logiAndThrow(...params) {
    const errorEvent = this.errorService.logi(...params);
    throw Error(errorEvent);
  }

  loge(...params) {
    this.errorService.loge(...params);
  }

  logw(...params) {
    this.errorService.logw(...params);
  }

  logi(...params) {
    this.errorService.logi(...params);
  }

  throw(message: string) {
    throw new Error(message);
  }

  // protected isSuperUser(role) {
  //   return [Role.Manager, Role.Support].includes(role);
  // }


  /***********************/
  /*    U T I L S        */
  /***********************/

  protected getObjectId(id: string) {
    return new mongodb.ObjectID(id);
  }

  protected verifyMongoQueryArrayValue(query, key) {
    const value = query[key];
    if (value && Array.isArray(value)) query[key] = (value.length === 1 ? value[0] : { $in: value });
  }

  protected getMongoQueryValue(value) {
    return Array.isArray(value) ? (value.length === 1 ? value[0] : { $in: value }) : value;
  }

}
