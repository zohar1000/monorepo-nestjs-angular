import { ToastrService } from 'ngx-toastr';
import { Observable, Observer, Subscription } from 'rxjs';
import { Directive, inject, OnDestroy } from '@angular/core';
import { ErrorLogService } from '../services/error-log.service';
import { AppEventsService } from '../services/app-events.service';
import { AppEventType } from '../enums/app-event-type.enum';
// import { ApiService } from '@sample-app/core/services/api.service';

@Directive()
export abstract class BaseGeneric implements OnDestroy {
  protected appEventsService: AppEventsService;
  protected toastrService: ToastrService;
  protected loggingService: ErrorLogService;
  subscriptions: Subscription[] = [];

  constructor() {
    this.appEventsService = inject(AppEventsService);
    this.toastrService = inject(ToastrService);
    this.loggingService = inject(ErrorLogService);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => { if (!sub.closed) sub.unsubscribe(); });
  }

  subscribe(observable: Observable<any>, observer: Partial<Observer<any>>) {
    const subscription: Subscription = observable.subscribe(observer);
    this.subscriptions.push(subscription);
    return subscription;
  }

  protected showSuccessToastr(message?, title?) {
    this.toastrService.success(message, title);
  }

  protected showErrorToastr(message?, title?) {
    this.toastrService.error(message, title);
  }

  protected logError(message, ...params) {
    this.loggingService.logError(message, ...params);
  }

  showAppSpinner() {
    this.appEventsService.emit(AppEventType.ShowAppSpinner);
  }

  hideAppSpinner() {
    this.appEventsService.emit(AppEventType.HideAppSpinner);
  }
}
