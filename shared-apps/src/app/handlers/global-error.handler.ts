import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import { ErrorLogService } from '../services/error-log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  errorLogService: ErrorLogService;

  constructor(private injector: Injector) {}

  handleError(error) {
// console.log('error message:', `Error ${error.status} - ${error.statusText}`);
    if (!this.errorLogService) this.errorLogService = this.injector.get(ErrorLogService);
    if (this.errorLogService) {
      this.errorLogService.logError('An unhandled error occurred', error);
    } else {
      console.log('An unhandled error occurred', error);
    }
  }
}
