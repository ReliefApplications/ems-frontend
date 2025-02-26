import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { EmailService } from '../../email.service';

/**
 * Chose role component, to preview application with selected role.
 */
@Component({
  selector: 'preview-distribution',
  templateUrl: './preview-distribution.component.html',
  styleUrls: ['./preview-distribution.component.scss'],
})
export class PreviewDistributionComponent {
  /** Expand for "To" list items. */
  isExpandedTo = false;
  /** Expand for "CC" list items. */
  isExpandedCc = false;
  /** Expand for "BCC" list items. */
  isExpandedBcc = false;

  /**
   * Chose role component, to preview application with selected role.
   *
   * @param dialogRef Dialog ref
   * @param data Injected modal data
   * @param emailService Email Service
   */
  constructor(
    public dialogRef: DialogRef<PreviewDistributionComponent>,
    @Inject(DIALOG_DATA) public data: any,
    public emailService: EmailService
  ) {}

  /**
   * Expand see more email list dropdown for "To".
   */
  toggleExpandTo() {
    this.isExpandedTo = !this.isExpandedTo;
  }

  /**
   * Expand see more email list dropdown for "Cc".
   */
  toggleExpandCc() {
    this.isExpandedCc = !this.isExpandedCc;
  }

  /**
   * Expand see more email list dropdown for "Bcc".
   */
  toggleExpandBcc() {
    this.isExpandedBcc = !this.isExpandedBcc;
  }
}
