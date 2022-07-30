import { Component } from '@angular/core';
import { AuthService } from '@shared-apps/services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '@shared-apps/services/http.service';
import { BaseComponent } from '@shared-apps/classes/base.component';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { AppEventType } from '@shared-apps/enums/app-event-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(private authService: AuthService,
              private router: Router,
              private httpService: HttpService) {
    super();
    this.appEventsService.subscribe(AppEventType.ShowAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = true));
    this.appEventsService.subscribe(AppEventType.HideAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = false));
    if (!this.authService.isAccessToken()) {
      this.router.navigate(['/login']).then();
    } else {
      this.subscribe(this.httpService.get('api/v1/auth/permissions'), {
        next: (response: ServerResponse) => {
          this.authService.onLogin(response.data);
          this.router.navigate([location.pathname]).then();
        },
        error: error => {
          console.log('permissions error response:', error);
        }
      })
    }
  }
}
