import { Injectable } from '@angular/core';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';
import { HttpHeaders } from '@angular/common/http';
import { Dialog } from '@angular/cdk/dialog';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { prettifyLabel } from '../../utils/prettify';
import { firstValueFrom, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from '../rest/rest.service';
import { SnackbarService } from '@oort-front/ui';
import { flatDeep } from '../../utils/array-filter';

/**
 * Shared email service.
 * Used by widgets to send request to the back to send emails.
 */
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  /**
   * Shared email service.
   * Used by widgets to send request to the back to send emails.
   *
   * @param snackBar Shared snackbar service.
   * @param dialog The Dialog service.
   * @param translate Angular translate service.
   * @param restService Shared rest service.
   */
  constructor(
    private snackBar: SnackbarService,
    private dialog: Dialog,
    private translate: TranslateService,
    private restService: RestService
  ) {}

  /**
   * Send a POST request to the server with the files attached to the
   * request body
   *
   * @param {any[]} files - array of files to send to the server.
   * @returns Observable of the POST request
   */
  public sendFiles(files: any[]): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    const formData = new FormData();
    for (const file of files) {
      formData.append('attachments', file, file.name);
    }
    return this.restService.post('/email/files', formData, { headers });
  }

  /**
   * Ask the back to send the email.
   *
   * @param recipient Recipient of the email.
   * @param subject Subject of the email.
   * @param body Body of the email, if not given we put the formatted records.
   * @param filter Filters for sending the mail
   * @param query Query settings
   * @param query.name Name of the query
   * @param query.fields Fields requested in the query
   * @param sortField Sort field (optional).
   * @param sortOrder Sort order (optional).
   * @param attachment Whether an excel with the dataset is attached to the mail
   * or not (optional).
   * @param files List of files to send with the mail (optional).
   */
  public async sendMail(
    recipient: string[],
    subject: string,
    body: string,
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
      SnackbarSpinnerComponent,
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
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
    let fileFolderId = '';
    if (files && files.length > 0) {
      const response = await firstValueFrom(this.sendFiles(files));
      if (response.id) {
        fileFolderId = response.id;
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.restService
      .post(
        '/email/',
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
      .subscribe({
        next: () => {
          (snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.sent'
          )),
            (snackBarSpinner.instance.loading = false);

          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
        error: () => {
          (snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.error'
          )),
            (snackBarSpinner.instance.loading = false);
          snackBarSpinner.instance.error = true;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
      });
  }

  /**
   * Open a preview of email to send.
   *
   * @param recipient Recipient of the email.
   * @param subject Subject of the email.
   * @param body Body of the email, if not given we put the formatted records.
   * @param filter Filters for sending the mail
   * @param query Query settings
   * @param query.name Name of the query
   * @param query.fields Fields requested in the query
   * @param sortField Sort field (optional).
   * @param sortOrder Sort order (optional).
   * @param attachment Whether an excel with the dataset is attached to the mail
   * or not (optional).
   */
  public async previewMail(
    recipient: string[],
    subject: string,
    body: string,
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
      SnackbarSpinnerComponent,
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
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.restService
      .post(
        '/email/preview/',
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
      .subscribe({
        next: async (res) => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.ready'
          );
          snackBarSpinner.instance.loading = false;
          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
          const { EmailPreviewComponent } = await import(
            '../../components/email-preview/email-preview.component'
          );
          const dialogRef = this.dialog.open(EmailPreviewComponent, {
            data: res,
            autoFocus: false,
            disableClose: true,
            width: '100%',
          });
          dialogRef.closed.subscribe((value: any) => {
            if (value) {
              this.sendMail(
                value.to,
                value.subject,
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
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;

          setTimeout(() => snackBarRef.instance.dismiss(), 1000);
        },
      });
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
              width: f.width,
            };
          }
          default: {
            const title = f.label ? f.label : prettifyLabel(f.name);
            return {
              name: fullName,
              title,
              width: f.width,
            };
          }
        }
      })
    );
  }
}
