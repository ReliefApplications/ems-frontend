import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafeDownloadService {

  constructor(private http: HttpClient) { }

  getFile(url: string, type: string, fileName: string, options?: any): void {
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    this.http.get(url, { ...options, responseType: 'blob', headers }).subscribe((res) => {
      const blob = new Blob([res], { type });
      this.saveFile(fileName, blob);
    });
  }

  saveFile(fileName: string, blob: Blob): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    setTimeout(() => link.remove(), 0);
  }
}
