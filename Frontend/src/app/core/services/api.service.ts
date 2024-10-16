import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * API service.
 * This service is used to make API calls.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {

  //#region Private Properties
  /////////////////////////////////////////////////////////////

  private readonly baseUrl = environment.apiEndpoint;
  private readonly httpClient = inject(HttpClient);

  /////////////////////////////////////////////////////////////
  //#endregion

  //#region Public Properties
  /////////////////////////////////////////////////////////////

  /**
   * Regular Get request without options
   * @param url - URL
   * @returns Observable<T>
   */
  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/${url}`);
  }

  /**
   * Regular Post request without options
   * @param url - URL
   * @param body - request body
   * @returns Observable<T>
   */
  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${url}`, body);
  }

  /**
   * Regular Put request without options
   * @param url - URL
   * @param body - request body
   * @returns
   */
  put<T>(url: string, body: any): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}/${url}`, body);
  }

  /**
   * Regular Patch request without options
   * @param url - URL
   * @param body - request body
   * @returns
   */
  patch<T>(url: string, body: any): Observable<T> {
    return this.httpClient.patch<T>(`${this.baseUrl}/${url}`, body);
  }

  /////////////////////////////////////////////////////////////
  //#endregion

}
