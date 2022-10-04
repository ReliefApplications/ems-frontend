import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NOTIFICATIONS } from '../const/notifications';
import { SafeSnackBarService } from './snackbar.service';

/**
 * Shared download service. Handles export and upload events.
 * TODO: rename in file service
 */
@Injectable({
  providedIn: 'root',
})
export class SafeDownloadService {
  /** API base url */
  public baseUrl: string;

  /**
   * Shared download service. Handles export and upload events.
   * TODO: rename in file service
   *
   * @param environment Current environment
   * @param http Http client
   * @param snackBar Safe snackbar service
   */
  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient,
    private snackBar: SafeSnackBarService
  ) {
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Downloads file from the server
   *
   * @param path download path to append to base url
   * @param type type of the file
   * @param fileName name of the file
   * @param options (optional) request options
   */
  getFile(path: string, type: string, fileName: string, options?: any): void {
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get(url, { ...options, responseType: 'blob', headers })
      .subscribe((res) => {
        const blob = new Blob([res], { type });
        this.saveFile(fileName, blob);
      });
  }

  /**
   * Downloads records file from the server with a POST request
   *
   * @param path download path to append to base url
   * @param type type of the file
   * @param fileName name of the file
   * @param body (optional) request body
   */
  getRecordsExport(
    path: string,
    type: string,
    fileName: string,
    body?: any
  ): void {
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
    this.http
      .post(url, body, { responseType: 'blob', headers })
      .subscribe((res) => {
        if (body?.email) {
          this.snackBar.openSnackBar(NOTIFICATIONS.fileExportOngoing);
        } else {
          const blob = new Blob([res], { type });
          this.saveFile(fileName, blob);
        }
      });
  }

  /**
   * Saves file from blob
   *
   * @param fileName name of the file
   * @param blob File blob
   */
  private saveFile(fileName: string, blob: Blob): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    setTimeout(() => link.remove(), 0);
  }

  /**
   * Uploads a file
   *
   * @param path request path
   * @param file file to upload
   * @returns http upload request
   */
  uploadFile(path: string, file: any): Observable<any> {
    const url = this.buildURL(path);
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    formData.append('excelFile', file, file.name);
    return this.http.post(url, formData, { headers });
  }

  /**
   * Builds url from path.
   *
   * @param path Request path
   * @returns full url
   */
  private buildURL(path: string): string {
    return path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
  }
}
