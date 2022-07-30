import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppEventType } from '../enums/app-event-type.enum';

@Injectable({ providedIn: 'root' })
export class AppEventsService {
  subjects = {
    [AppEventType.ShowAppSpinner]: new Subject(),
    [AppEventType.HideAppSpinner]: new Subject()
  }

  emit(type: AppEventType, data?) {
    const subject = this.subjects[type];
    subject.next(data);
  }

  subscribe(type: AppEventType): Observable<any> {
    const subject = this.subjects[type];
    return subject as Observable<any>;
  }
}
