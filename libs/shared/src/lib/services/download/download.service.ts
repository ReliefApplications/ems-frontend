import { HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';
import { RestService } from '../rest/rest.service';
import { Application } from '../../models/application.model';
import { SnackbarService } from '@oort-front/ui';
import { DOCUMENT } from '@angular/common';

/** Types of file we upload to blob storage */
export enum BlobType {
  RECORD_FILE = 'file',
  APPLICATION_STYLE = 'style',
}

/** Mapping of upload type to REST path */
const BLOB_TYPE_TO_PATH: Record<BlobType, string> = {
  [BlobType.RECORD_FILE]: 'file',
  [BlobType.APPLICATION_STYLE]: 'style',
};

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 3000;

/**
 * Shared download service. Handles export and upload events.
 * TODO: rename in file service
 */
@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  /**
   * Shared download service. Handles export and upload events.
   * TODO: rename in file service
   *
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param restService Shared rest service
   * @param document document
   */
  constructor(
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private restService: RestService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Set up a snackbar element with the given message and duration
   *
   * @param {string} translationKey Translation key for the file download snackbar message
   * @param {duration} duration Time duration of the opened snackbar element
   * @returns snackbar reference
   */
  private createLoadingSnackbarRef(translationKey: string, duration = 0) {
    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SnackbarSpinnerComponent,
      {
        duration,
        data: {
          message: this.translate.instant(translationKey),
          loading: true,
        },
      }
    );
    return snackBarRef;
  }

  /**
   * Set up needed headers and response information for the file download action
   *
   * @param translationKey Translation key for the file download snackbar message
   * @returns snackbar reference and header for the file download request
   */
  private triggerFileDownloadMessage(translationKey: string) {
    // Opens a loader in a snackbar
    const snackBarRef = this.createLoadingSnackbarRef(translationKey);
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
    });
    return { snackBarRef, headers };
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
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    this.restService
      .get(path, { ...options, responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          const blob = new Blob([res], { type });
          this.saveFile(fileName, blob);
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.ready'
          );
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
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
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    this.restService
      .post(path, body, { responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          if (body?.email) {
            snackBarSpinner.instance.message = this.translate.instant(
              'common.notifications.file.download.ongoing'
            );
            snackBarSpinner.instance.loading = false;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
          } else {
            const blob = new Blob([res], { type });
            this.saveFile(fileName, blob);
            snackBarSpinner.instance.message = this.translate.instant(
              'common.notifications.file.download.ready'
            );
            snackBarSpinner.instance.loading = false;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
          }
        },
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
      });
  }

  /**
   * Downloads activities for current application
   *
   * @param path download path to append to base url
   * @param fileName File name
   * @param body Request body
   */
  getActivitiesExport(path: string, fileName: string, body: any) {
    const { snackBarRef } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    this.restService.post(path, body, { responseType: 'blob' }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'xlsx' });
        this.saveFile(fileName, blob);
        snackBarSpinner.instance.message = this.translate.instant(
          'common.notifications.file.download.ready'
        );
        snackBarSpinner.instance.loading = false;
        snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
      },
      error: () => {
        snackBarSpinner.instance.message = this.translate.instant(
          'common.notifications.file.download.error'
        );
        snackBarSpinner.instance.loading = false;
        snackBarSpinner.instance.error = true;
        snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
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

    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    this.restService
      .post(path, { users }, { responseType: 'blob', headers })
      .subscribe(
        (res) => {
          const blob = new Blob([res], { type: `text/${type};charset=utf-8;` });
          this.saveFile(fileName, blob);
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.ready'
          );
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
        () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
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
    const link = this.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    this.document.body.append(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  }

  /**
   * Uploads a file
   *
   * @param path request path
   * @param file file to upload
   * @returns http upload request
   */
  uploadFile(path: string, file: any): Observable<any> {
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.upload.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    const formData = new FormData();
    formData.append('excelFile', file, file.name);
    return this.restService.post(path, formData, { headers }).pipe(
      tap({
        next: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.upload.ready'
          );
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.upload.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
      })
    );
  }

  /**
   * Uploads a file to the blob storage
   *
   * @param file The file to upload
   * @param type Either 'file' or 'style'
   * @param entity ID of the entity the file is related to
   * @returns The path of the uploaded file
   */
  uploadBlob(
    file: any,
    type: BlobType,
    entity: string
  ): Promise<string | void> {
    const snackBarRef = this.createLoadingSnackbarRef(
      'common.notifications.file.upload.processing'
    );
    const snackBarInstance = snackBarRef.instance.nestedComponent.instance;
    const path = `upload/${BLOB_TYPE_TO_PATH[type]}/${entity}`;
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
    });
    const formData = new FormData();
    formData.append('file', file, file.name);
    return new Promise((resolve, reject) => {
      this.restService.post(path, formData, { headers }).subscribe({
        next: (res: { path: string }) => {
          const { path } = res ?? {};
          if (path) {
            snackBarInstance.message = this.translate.instant(
              'common.notifications.file.upload.ready'
            );
            snackBarInstance.loading = false;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            resolve(path);
          } else {
            snackBarInstance.message = this.translate.instant(
              'common.notifications.file.upload.error'
            );
            snackBarInstance.loading = false;
            snackBarInstance.error = true;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            reject();
          }
        },
        error: (error) => {
          snackBarInstance.message = error.message;
          snackBarInstance.loading = false;
          snackBarInstance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
          reject();
        },
      });
    });
  }

  /**
   * Generic file download
   *
   * @param filename file name
   * @param type file type
   * @param observable Query that returns a file, as observable
   */
  download(
    filename: string,
    type: 'text/xlsx;charset=utf-8;',
    observable: Observable<unknown>
  ): void {
    const { snackBarRef } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );

    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    observable.subscribe({
      next: (file: any) => {
        const blob = new Blob([file], { type });
        this.saveFile(filename, blob);
        snackBarSpinner.instance.message = this.translate.instant(
          'common.notifications.file.download.ready'
        );
        snackBarSpinner.instance.loading = false;
        setTimeout(() => snackBarRef.instance.dismiss(), SNACKBAR_DURATION);
      },
      error: () => {
        snackBarSpinner.instance.message = this.translate.instant(
          'common.notifications.file.download.error'
        );
        snackBarSpinner.instance.loading = false;
        snackBarSpinner.instance.error = true;
        setTimeout(() => snackBarRef.instance.dismiss(), SNACKBAR_DURATION);
      },
    });
  }
}
