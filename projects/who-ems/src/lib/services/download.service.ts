import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhoDownloadService {

  constructor(private http: HttpClient) { }

  getFile(url: string, type: string, fileName: string, options?: any): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((res) => {
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
