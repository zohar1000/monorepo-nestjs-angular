import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '@shared-all/models/entities/user.entity';
import { LocalStorageService } from './local-storage.service';
import { AuthTokenName } from '../enums/auth-token-name.enum';
import { HttpService } from './http.service';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { ServerLoginResponse } from '@shared-all/models/server-login-response.model';
import { RefreshTokenResponse } from '@shared-all/models/refresh-token-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject(false);
  user: Partial<User>;

  constructor(private localStorageService: LocalStorageService, private httpService: HttpService) { }

  onLogin(user, tokens?) {
    this.user = user;
    if (tokens) this.storeAuthTokens(tokens);
    this.isLoggedIn$.next(true);
  }

  onLogout() {
    this.user = null;
    this.isLoggedIn$.next(false);
  }

  isAccessToken() {
    return this.getAccessToken() !== null;
  }

  getAccessToken() {
    return localStorage.getItem(AuthTokenName.Access);
  }

  refresh(): Observable<ServerResponse> {
    const refreshToken = localStorage.getItem(AuthTokenName.Refresh);
    if (refreshToken) {
      return this.httpService.post(`api/v1/auth/refresh`, { refreshToken });
    } else {
      return of({ isSuccess: false });
    }
  }

  storeAuthTokens(data: ServerLoginResponse | RefreshTokenResponse) {
    this.localStorageService.setItem(AuthTokenName.Access, data.accessToken);
    this.localStorageService.setItem(AuthTokenName.Refresh, data.refreshToken);
  }
}
