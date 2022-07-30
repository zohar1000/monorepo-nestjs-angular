import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { HttpService } from '../../services/http.service';
import { SharedAppsModule } from '../../../shared-apps.module';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [SharedAppsModule],
  standalone: true
})
export class LoginComponent {
  formGroup: FormGroup;
  errorMessage = '';

  constructor(private authService: AuthService,
              private httpService: HttpService,
              private router: Router) {
    this.formGroup = new FormGroup({
      userName: new FormControl(environment.login.userName),
      password: new FormControl(environment.login.password)
    })
  }

  onClickSubmit() {
    if (!this.formGroup.valid) return;
    this.errorMessage = '';
      this.httpService.post('api/v1/auth/login', this.formGroup.value).subscribe({
      next: (response: ServerResponse) => {
        if (!response.isSuccess) {
          this.errorMessage = response.error.message;
        } else {
          this.authService.onLogin(response.data.user, response.data);
          this.router.navigate(['']).then();
        }
      },
      error: error => {
        console.log('ERROR login response');
        this.errorMessage = 'invalid user/password';
      }
    })
  }
}
