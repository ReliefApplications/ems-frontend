import { Injectable } from '@angular/core';
import { SafeSnackBarService } from './snackbar.service';
import { NOTIFICATIONS } from '../const/notifications';
import { SafePreprocessorService } from './preprocessor.service';
import {Clipboard} from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class SafeEmailService {

  constructor(
    private snackBar: SafeSnackBarService,
    private preprocessor: SafePreprocessorService,
    private clipboard: Clipboard
  ) { }

  /**
   * Opens a mail client with items in the body.
   * @param recipient recipient of the email.
   * @param subject subject of the email.
   * @param body body of the email, if not given we put the formatted records.
   * @param settings query settings.
   * @param ids list of records to include in the email.
   * @param sortField sort field
   * @param sortOrder sort order
   */
  public async sendMail(
    recipient: string, subject: string, body: string = '{dataset}', settings: any, ids: string[],
    sortField?: string, sortOrder?: string): Promise<void> {

    body = await this.preprocessor.preprocess(body, {settings, ids, sortField, sortOrder });
    this.clipboard.copy(body);
    this.snackBar.openSnackBar(NOTIFICATIONS.emailBodyCopiedToClipboard, { duration: 3000});

    subject = await this.preprocessor.preprocess(subject);

    // === SEND THE EMAIL ===
    try {
      window.location.href = `mailto:${recipient}?subject=${subject}`;
    } catch (error) {
      this.snackBar.openSnackBar(NOTIFICATIONS.emailTooLong(error), { error: true });
      try {
        window.location.href = `mailto:${recipient}?subject=${subject}`;
      } catch (error) {
        this.snackBar.openSnackBar(NOTIFICATIONS.emailClientNotResponding(error), { error: true });
      }
    }
  }
}
