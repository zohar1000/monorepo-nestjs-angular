import { Component } from '@angular/core';
import { Severity } from '@enums/severity.enum';
import { Test9Model } from '@shared-apps/models/test9.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  test: Test9Model = {
    prop1: Severity.Error,
    prop2: 'a'
  };

  time = Date.now();
}
