// src/app/service/tcc-service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TCC } from '../model/tcc-model';
import { environment } from '../../environments/environment'; // ← Agora vai funcionar

@Injectable({
  providedIn: 'root'
})
export class TccService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tccs`; // ← Usando environment

  getTccs(params?: { page?: number; size?: number; status?: string }): Observable<TCC[]> {
    let httpParams = new HttpParams();
    
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.size) httpParams = httpParams.set('size', params.size.toString());
    if (params?.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<TCC[]>(this.apiUrl, { params: httpParams });
  }

  getTccById(id: number): Observable<TCC> {
    return this.http.get<TCC>(`${this.apiUrl}/${id}`);
  }

  createTcc(tcc: TCC): Observable<TCC> {
    return this.http.post<TCC>(this.apiUrl, tcc);
  }

  updateTcc(id: number, tcc: TCC): Observable<TCC> {
    return this.http.put<TCC>(`${this.apiUrl}/${id}`, tcc);
  }

  patchTcc(id: number, partialTcc: Partial<TCC>): Observable<TCC> {
    return this.http.patch<TCC>(`${this.apiUrl}/${id}`, partialTcc);
  }

  deleteTcc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}