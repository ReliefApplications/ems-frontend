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
import {
  GET_CUSTOM_TEMPLATES,
  GET_DISTRIBUTION_LIST,
} from '../../components/email/graphql/queries';
import { Apollo } from 'apollo-angular';

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 1000;

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
   * @param apollo the graphQL client service
   */
  constructor(
    private snackBar: SnackbarService,
    private dialog: Dialog,
    private translate: TranslateService,
    private restService: RestService,
    private apollo: Apollo
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
    return new Promise<void>((resolve, reject) => {
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
      const send = () => {
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
              snackBarSpinner.instance.message = this.translate.instant(
                'common.notifications.email.sent'
              );
              snackBarSpinner.instance.loading = false;
              snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
              resolve();
            },
            error: () => {
              snackBarSpinner.instance.message = this.translate.instant(
                'common.notifications.email.error'
              );
              snackBarSpinner.instance.loading = false;
              snackBarSpinner.instance.error = true;
              snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
              reject();
            },
          });
      };
      if (files && files.length > 0) {
        firstValueFrom(this.sendFiles(files))
          .then((response) => {
            if (response.id) {
              fileFolderId = response.id;
            }
            send();
          })
          .catch((error) => {
            snackBarSpinner.instance.message = error.message;
            snackBarSpinner.instance.loading = false;
            snackBarSpinner.instance.error = true;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            reject(error);
          });
      } else {
        send();
      }
    });
  }

  /**
   * Open a preview of email to send.
   *
   * @param recipient Recipient of the email.
   * @param subject Subject of the email.
   * @param query Query settings
   * @param query.name Name of the query
   * @param query.fields Fields requested in the query
   * @param filter Filters for sending the mail
   * @param body Body of the email, if not given we put the formatted records.
   * @param sortField Sort field (optional).
   * @param sortOrder Sort order (optional).
   * @param attachment Whether an excel with the dataset is attached to the mail
   * or not (optional).
   */
  public async previewMail(
    recipient: string[],
    subject: string,
    query: {
      name: string;
      fields: any[];
    },
    filter: CompositeFilterDescriptor,
    body?: string,
    sortField?: string,
    sortOrder?: string,
    attachment?: boolean
  ): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant(
            'common.notifications.email.preview.processing'
          ),
          loading: true,
        },
      }
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
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
          const { EmailPreviewModalComponent } = await import(
            '../../components/email-preview-modal/email-preview-modal.component'
          );
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.ready'
          );
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
          this.dialog.open(EmailPreviewModalComponent, {
            data: {
              ...res,
              onSubmit: async (value: any) => {
                snackBarSpinner.instance.message = this.translate.instant(
                  'common.notifications.email.processing'
                );
                snackBarSpinner.instance.loading = true;
                snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
                try {
                  await this.sendMail(
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
                  snackBarSpinner.instance.message = this.translate.instant(
                    'common.notifications.email.sent'
                  );
                  snackBarSpinner.instance.loading = false;
                  snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
                } catch (error) {
                  snackBarSpinner.instance.message = this.translate.instant(
                    'common.notifications.email.error'
                  );
                  snackBarSpinner.instance.loading = false;
                  snackBarSpinner.instance.error = true;
                  snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
                }
              },
            },
            autoFocus: false,
            disableClose: true,
            width: '100%',
          });
          // dialogRef.closed.subscribe((value: any) => {
          //   if (value) {
          //     this.sendMail(
          //       value.to,
          //       value.subject,
          //       value.html,
          //       filter,
          //       query,
          //       sortField,
          //       sortOrder,
          //       attachment,
          //       value.files
          //     );
          //   }
          // });
        },
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.email.errors.preview'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
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

  /**
   * Retrieves custom templates from the server.
   *
   * @returns {Observable<any>} An observable that resolves with the result of the query.
   */
  getCustomTemplates(): Observable<any> {
    return this.apollo.query<any>({
      query: GET_CUSTOM_TEMPLATES,
      variables: {},
    });
  }

  /**
   * Get an email distribution lists.
   *
   * @returns Email distribution lists.
   */
  getEmailDistributionList() {
    return this.apollo.query<any>({
      query: GET_DISTRIBUTION_LIST,
      variables: {},
    });
  }

  /**
   * Preview custom email template.
   *
   * @param emailContent Email content
   * @param distributionListInfo Distribution list
   * @param selectedRowsFromGrid Selected rows from grid
   * @param resourceData Resource metadata
   * @param selectedLayoutFields Selected layout fields
   * @param widgetSettings Widget settings of the grid
   */
  async previewCustomTemplate(
    emailContent: any,
    distributionListInfo: any,
    selectedRowsFromGrid: any,
    resourceData: any,
    selectedLayoutFields: any,
    widgetSettings: any
  ) {
    const { PreviewTemplateModalComponent } = await import(
      '../../components/templates/components/preview-template-modal/preview-template-modal.component'
    );
    this.dialog.open(PreviewTemplateModalComponent, {
      data: {
        emailContent,
        distributionListInfo,
        selectedRowsFromGrid,
        resourceData,
        selectedLayoutFields,
        widgetSettings,
      },
      autoFocus: false,
      disableClose: true,
      width: '80%',
    });
  }
}
