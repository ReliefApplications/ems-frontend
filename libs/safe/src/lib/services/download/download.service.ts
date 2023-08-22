import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SafeSnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';
import { SafeRestService } from '../rest/rest.service';
import { Application } from '../../models/application.model';
import { SnackbarService } from '@oort-front/ui';

/**
 * Shared download service. Handles export and upload events.
 * TODO: rename in file service
 */
@Injectable({
  providedIn: 'root',
})
export class SafeDownloadService {
  /**
   * Shared download service. Handles export and upload events.
   * TODO: rename in file service
   *
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param restService Shared rest service
   */
  constructor(
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private restService: SafeRestService
  ) {}

  /**
   * Downloads file from the server
   *
   * @param path download path to append to base url
   * @param type type of the file
   * @param fileName name of the file
   * @param options (optional) request options
   */
  getFile(path: string, type: string, fileName: string, options?: any): void {
    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.file.download.processing'
          ),
          loading: true,
        },
      }
    );
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
    this.restService
      .get(path, { ...options, responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          const blob = new Blob([res], { type });
          this.saveFile(fileName, blob);
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.download.ready'
          );
          snackBarRef.instance.loading = false;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
        error: () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarRef.instance.loading = false;
          snackBarRef.instance.error = true;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
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
    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.file.download.processing'
          ),
          loading: true,
        },
      }
    );
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
    this.restService
      .post(path, body, { responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          if (body?.email) {
            snackBarRef.instance.message = this.translate.instant(
              'common.notifications.file.download.ongoing'
            );
            snackBarRef.instance.loading = false;
            setTimeout(() => snackBarRef.instance.dismiss(), 1000);
          } else {
            const blob = new Blob([res], { type });
            this.saveFile(fileName, blob);
            snackBarRef.instance.message = this.translate.instant(
              'common.notifications.file.download.ready'
            );
            snackBarRef.instance.loading = false;
            setTimeout(() => snackBarRef.instance.dismiss(), 1000);
          }
        },
        error: () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarRef.instance.loading = false;
          snackBarRef.instance.error = true;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
      });
  }

  /**
   * Downloads file with users from the server
   *
   * @param type type of the file
   * @param users users to export, if any
   * @param application application get export users from, if any
   */
  getUsersExport(
    type: 'csv' | 'xlsx',
    users: string[],
    application?: Application
  ): void {
    const fileName = application
      ? `users_${application.name}.${type}`
      : `users.${type}`;

    const queryString = new URLSearchParams({ type }).toString();
    const path = application
      ? `download/application/${application.id}/users?${queryString}`
      : `download/users?${queryString}`;

    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.file.download.processing'
          ),
          loading: true,
        },
      }
    );
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
    this.restService
      .post(path, { users }, { responseType: 'blob', headers })
      .subscribe(
        (res) => {
          const blob = new Blob([res], { type: `text/${type};charset=utf-8;` });
          this.saveFile(fileName, blob);
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.download.ready'
          );
          snackBarRef.instance.loading = false;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
        () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarRef.instance.loading = false;
          snackBarRef.instance.error = true;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        }
      );
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
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.file.upload.processing'
          ),
          loading: true,
        },
      }
    );
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
    });
    const formData = new FormData();
    formData.append('excelFile', file, file.name);
    return this.restService.post(path, formData, { headers }).pipe(
      tap({
        next: () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.upload.ready'
          );
          snackBarRef.instance.loading = false;

          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
        error: () => {
          snackBarRef.instance.message = this.translate.instant(
            'common.notifications.file.upload.error'
          );
          snackBarRef.instance.loading = false;
          snackBarRef.instance.error = true;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
      })
    );
  }
}
