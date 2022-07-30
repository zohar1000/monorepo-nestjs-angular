import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { FileService } from './file.service';
import { SanitationService } from './sanitation.service';
// import { AppEventsService }         from './app-events.service';
// import { MailService }              from './mail.service';
// import { RequestLogsService } from './db/request-logs.service';

@Injectable()
export class GlobalService {
  static globalService$ = new ReplaySubject(1);
  static errorService: ErrorService;
  static fileService: FileService;
  static sanitationService: SanitationService;

  static setGlobalServices(inst) {
    const subscription = (GlobalService.globalService$.pipe(first()) as ReplaySubject<any>).subscribe((globalServices): void => {
      inst.errorService = globalServices.errorService;
      inst.fileService = globalServices.fileService;
      inst.sanitationService = globalServices.sanitationService;
      // this.appEventsService = globalServices.appEventsService;
      // this.mailService = globalServices.mailService;
      setTimeout(() => subscription.unsubscribe(), 0);
    });
  }
}
