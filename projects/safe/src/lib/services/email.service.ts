import { Injectable } from '@angular/core';
import { SafeSnackBarService } from './snackbar.service';
import { NOTIFICATIONS } from '../const/notifications';
import { SafePreprocessorService } from './preprocessor.service';

@Injectable({
  providedIn: 'root'
})
export class SafeEmailService {

  constructor(
    private snackBar: SafeSnackBarService,
    private preprocessor: SafePreprocessorService
  ) { }

  /**
   * Opens a mail client with items in the body.
   * @param recipient recipient of the email.
   * @param subject subject of the email.
   * @param settings query settings.
   * @param ids list of records to include in the email.
   * @param body body of the email, if not given we put the formatted records.
   */
  public async sendMail(recipient: string, subject: string, settings: any, ids: string[], body: string = '{dataset}'): Promise<void> {

    body = await this.preprocessor.preprocess(body, {settings, ids});
    subject = await this.preprocessor.preprocess(subject);

    // === SEND THE EMAIL ===
    try {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(body)}`;
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
