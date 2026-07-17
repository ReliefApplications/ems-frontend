import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TurnstileComponent } from '../turnstile/turnstile.component';

/** Model for the dialog data */
interface DialogData {
  /** Cloudflare Turnstile site key */
  siteKey: string;
}

/**
 * Captcha modal, displayed when submitting a form.
 * Closes with the generated captcha token once the challenge is completed.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    TurnstileComponent,
  ],
  selector: 'oort-front-captcha-modal',
  templateUrl: './captcha-modal.component.html',
})
export class CaptchaModalComponent {
  /**
   * Captcha modal, displayed when submitting a form.
   *
   * @param dialogRef The reference of the dialog, closed with the captcha token
   * @param data The data for the dialog
   */
  constructor(
    public dialogRef: DialogRef<string | null>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Closes the modal with the token once the challenge is completed.
   *
   * @param token Captcha token, or null when it expires or fails
   */
  onToken(token: string | null): void {
    if (token) {
      this.dialogRef.close(token);
    }
  }
}
