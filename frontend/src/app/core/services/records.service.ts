import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RecordsResponse } from '../models/record.model';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private baseUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  getRecords(delayMs = 0): Observable<RecordsResponse> {
    const params = delayMs > 0 ? new HttpParams().set('delay', delayMs) : undefined;
    return this.http.get<RecordsResponse>(this.baseUrl, { params });
  }
}
