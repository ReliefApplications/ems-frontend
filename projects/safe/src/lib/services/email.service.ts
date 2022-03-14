import { Inject, Injectable } from '@angular/core';
import { SafeSnackBarService } from './snackbar.service';
import { SafeSnackbarSpinnerComponent } from '../components/snackbar-spinner/snackbar-spinner.component';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Shared email service.
 * Used by widgets to send request to the back to send emails.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeEmailService {
  private url: string;

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
    private translate: TranslateService
  ) {
    this.url = environment.apiUrl + '/email/';
  }

  /**
   * Opens a mail client with items in the body.
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
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    this.http
      .post(
        this.url,
        {
          recipient,
          subject,
          body,
          gridSettings,
          attachment,
        },
        { headers }
      )
      .subscribe(
        (res) => {
          snackBarRef.instance.data = {
            message: this.translate.instant('email.sent'),
            loading: false,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        },
        () => {
          snackBarRef.instance.data = {
            message: this.translate.instant('email.error'),
            loading: false,
            error: true,
          };
          setTimeout(() => snackBarRef.dismiss(), 1000);
        }
      );
  }
}
