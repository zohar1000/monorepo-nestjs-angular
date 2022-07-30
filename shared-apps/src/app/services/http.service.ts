import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse } from '@shared-all/models/server-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  get(relativeUrl): Observable<ServerResponse> {
    return this.httpClient.get(`${environment.host}/${relativeUrl}`) as Observable<ServerResponse>;
  }

  post(relativeUrl, payload): Observable<ServerResponse> {
    return this.httpClient.post(`${environment.host}/${relativeUrl}`, payload) as Observable<ServerResponse>;
  }
}
