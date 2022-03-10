import { Injectable } from '@angular/core';
import { SafeSnackBarService } from './snackbar.service';
import { Apollo } from 'apollo-angular';
import { sendEmailMutationResponse, SEND_EMAIL } from '../graphql/mutations';
import { SafeSnackbarSpinnerComponent } from '../components/snackbar-spinner/snackbar-spinner.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * Shared email service.
 * Used by widgets to open email clients and creates email text.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeEmailService {
  /**
   * Shared email service.
   * Used by widgets to open email clients and creates email text.
   *
   * @param snackBar Shared snackbar service
   * @param preprocessor Shared preprocessor service
   * @param clipboard Angular CDK clipboard service
   */
  constructor(
    private snackBar: SafeSnackBarService,
    private apollo: Apollo,
    private translate: TranslateService
  ) {}

  /**
   * Opens a mail client with items in the body.
   *
   * @param recipient recipient of the email.
   * @param subject subject of the email.
   * @param body body of the email, if not given we put the formatted records.
   * @param settings query settings.
   * @param ids list of records to include in the email.
   * @param sortField sort field
   * @param sortOrder sort order
   */
  public async sendMail(
    recipient: string[],
    subject: string,
    body: string = '{dataset}',
    gridSettings: {
      query: {
        name: string;
        fields: any[];
      };
      ids: string[];
      sortField?: string;
      sortOrder?: string;
    },
    attachment?: boolean
  ): Promise<void> {
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SafeSnackbarSpinnerComponent,
      {
        duration: 0,
        data: {
          message: this.translate.instant('email.processing'),
          loading: true,
        },
      }
    );
    this.apollo
      .mutate<sendEmailMutationResponse>({
        mutation: SEND_EMAIL,
        variables: {
          recipient,
          subject,
          body,
          gridSettings,
          attachment,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          snackBarRef.instance.data = {
            message: this.translate.instant('email.error'),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        } else {
          snackBarRef.instance.data = {
            message: this.translate.instant('email.sent'),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        }
      });
  }
}
