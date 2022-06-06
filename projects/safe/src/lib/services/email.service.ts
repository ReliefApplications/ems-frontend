import { Inject, Injectable } from '@angular/core';
import { SafeSnackBarService } from './snackbar.service';
import { SafeSnackbarSpinnerComponent } from '../components/snackbar-spinner/snackbar-spinner.component';
// import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SafeEmailPreviewComponent } from '../components/email-preview/email-preview.component';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { prettifyLabel } from '../utils/prettify';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const flatDeep = (arr: any[]): any[] =>
  arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val),
    []
  );

/**
 * Shared email service.
 * Used by widgets to send request to the back to send emails.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeEmailService {
  private sendUrl = '';
  private previewUrl = '';
  private filesUrl = '';

  /**
   * Shared email service.
   * Used by widgets to send request to the back to send emails.
   *
   * @param environment Injection of the environment file.
   * @param http Angular http client.
   * @param snackBar Shared snackbar service.
   * @param translate Angular translate service.
   */
  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient,
    private snackBar: SafeSnackBarService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.sendUrl = environment.apiUrl + '/email/';
    this.previewUrl = environment.apiUrl + '/email/preview/';
    this.filesUrl = environment.apiUrl + '/email/files';
  }

  public sendFiles(files: any[]): Observable<any> {
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    for (const file of files) {
      formData.append('attachments', file, file.name);
    }
    return this.http.post(this.filesUrl, formData, { headers });
  }

  /**
   * Ask the back to send the email.
   *
   * @param recipient Recipient of the email.
   * @param subject Subject of the email.
   * @param body Body of the email, if not given we put the formatted records.
   * @param gridSettings Grid specific settings.
   * @param gridSettings.query Query settings.
   * @param gridSettings.ids List of records to include in the email.
   * @param gridSettings.sortField Sort field.
   * @param gridSettings.sortOrder Sort order.
   * @param attachment Whether an excel with the dataset is attached to the mail or not.
   */
  public async sendMail(
    recipient: string[],
    subject: string,
    body: string = '{dataset}',
    filter: CompositeFilterDescriptor,
    query: {
      name: string;
      fields: any[];
    },
    sortField?: string,
    sortOrder?: string,
    attachment?: boolean,
    files?: any[]
  ): Promise<void> {
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.email.processing'
          ),
          loading: true,
        },
      }
    );
    let fileFolderId = '';
    if (files && files.length > 0) {
      const response = await this.sendFiles(files).toPromise();
      if (response.id) {
        fileFolderId = response.id;
      }
    }
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(
        this.sendUrl,
        {
          recipient,
          subject,
          body,
          filter,
          query,
          fields: this.getFields(query.fields),
          sortField,
          sortOrder,
          attachment,
          ...(fileFolderId && { files: fileFolderId }),
        },
        { headers }
      )
      .subscribe(
        (res) => {
          snackBarRef.instance.data = {
            message: this.translate.instant('common.notifications.email.sent'),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        },
        () => {
          snackBarRef.instance.data = {
            message: this.translate.instant('common.notifications.email.error'),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        }
      );
  }

  /**
   * Open a preview of email to send.
   *
   * @param recipient Recipient of the email.
   * @param subject Subject of the email.
   * @param body Body of the email, if not given we put the formatted records.
   * @param gridSettings Grid specific settings.
   * @param gridSettings.query Query settings.
   * @param gridSettings.ids List of records to include in the email.
   * @param gridSettings.sortField Sort field.
   * @param gridSettings.sortOrder Sort order.
   * @param attachment Whether an excel with the dataset is attached to the mail or not.
   */
  public async previewMail(
    recipient: string[],
    subject: string,
    body: string = '{dataset}',
    filter: CompositeFilterDescriptor,
    query: {
      name: string;
      fields: any[];
    },
    sortField?: string,
    sortOrder?: string,
    attachment?: boolean
  ): Promise<void> {
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.email.processing'
          ),
          loading: true,
        },
      }
    );
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.http
      .post(
        this.previewUrl,
        {
          recipient,
          subject,
          body,
          filter,
          query,
          fields: this.getFields(query.fields),
          sortField,
          sortOrder,
          attachment,
        },
        { headers }
      )
      .subscribe(
        (res) => {
          snackBarRef.instance.data = {
            message: this.translate.instant('common.notifications.email.ready'),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
          const dialogRef = this.dialog.open(SafeEmailPreviewComponent, {
            data: res,
            autoFocus: false,
            disableClose: true,
            width: '100%',
          });
          dialogRef.afterClosed().subscribe((value) => {
            if (value) {
              this.sendMail(
                recipient,
                subject,
                value.html,
                filter,
                query,
                sortField,
                sortOrder,
                attachment,
                value.files
              );
            }
          });
        },
        () => {
          snackBarRef.instance.data = {
            message: this.translate.instant('common.notifications.email.error'),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        }
      );
  }

  /**
   * Generates list of fields for the email, based on email parameters.
   *
   * @param fields list of fields saved in settings
   * @param prefix prefix of the field, generated from parents.
   * @returns List of fields for the email
   */
  private getFields(fields: any[], prefix?: string): any[] {
    return flatDeep(
      fields.map((f) => {
        const fullName: string = prefix ? `${prefix}.${f.name}` : f.name;
        switch (f.kind) {
          case 'OBJECT': {
            return this.getFields(f.fields, fullName);
          }
          case 'LIST': {
            const title = f.label ? f.label : prettifyLabel(f.name);
            const subFields = this.getFields(f.fields, fullName);
            return {
              name: fullName,
              title,
              subFields,
            };
          }
          default: {
            const title = f.label ? f.label : prettifyLabel(f.name);
            return {
              name: fullName,
              title,
            };
          }
        }
      })
    );
  }
}
