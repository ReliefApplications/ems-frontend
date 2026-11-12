import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, NgZone } from '@angular/core';
import { CommonModule, LocationStrategy } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../models/notification.model';
import { DateModule } from '../../../../pipes/date/date.module';
import { isSafeUrl } from '../../../../utils/safe-url';

/** Dialog data for notification detail modal */
interface DialogData {
  notification: Notification;
}

/** Link targets that load the link in place of the current page */
const CURRENT_PAGE_TARGETS = ['', '_self', '_parent', '_top'];

/**
 * Modal to display the full content of an in-app notification.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    DateModule,
  ],
  selector: 'shared-notification-detail-modal',
  templateUrl: './notification-detail-modal.component.html',
  styleUrls: ['./notification-detail-modal.component.scss'],
})
export class NotificationDetailModalComponent {
  /**
   * Sanitized email HTML, ready to be set as the iframe `srcdoc`.
   * Rendering inside a sandboxed iframe fully isolates the email's styles
   * from the application (and the application's styles from the email).
   * Scripts remain disabled in the sandbox. Links opening in a new tab are
   * allowed (outside of the sandbox), and links opening in the current page
   * are handled by the application, see `onLinkClick`.
   */
  public safeHtml: SafeHtml | null = null;

  /**
   * Notification detail modal component.
   *
   * @param dialogRef CDK dialog reference
   * @param data Dialog data containing the notification
   * @param sanitizer Angular DOM sanitizer
   * @param router Angular router
   * @param locationStrategy Angular location strategy
   * @param ngZone Angular zone
   */
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private ngZone: NgZone
  ) {
    const html = this.data.notification.content?.html;
    if (html) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  /**
   * Listen to clicks inside the email, once it is loaded in the iframe.
   *
   * @param event Load event of the iframe
   */
  onFrameLoad(event: Event): void {
    const frame = event.target as HTMLIFrameElement;
    // The iframe document is not patched by zone.js, so enter the zone manually
    frame.contentDocument?.addEventListener('click', (click) =>
      this.ngZone.run(() => this.onLinkClick(click))
    );
  }

  /**
   * Handle links of the email that open in the current page: the email
   * cannot navigate by itself, as it would load the link inside the iframe.
   * Links to the current application use the router, without reloading the
   * page. Other links load in place of the current page.
   * Links opening in a new tab are left to the browser.
   *
   * @param event Click event, from the iframe document
   */
  private onLinkClick(event: MouseEvent): void {
    // Clicks opening a new tab or window (middle click, ctrl + click, etc.)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const anchor = (event.target as Element | null)?.closest?.(
      'a[href]'
    ) as HTMLAnchorElement | null;
    if (
      !anchor ||
      anchor.hasAttribute('download') ||
      !CURRENT_PAGE_TARGETS.includes(anchor.target.toLowerCase()) ||
      // Anchor inside the email itself
      anchor.getAttribute('href')?.trim().startsWith('#')
    ) {
      return;
    }
    event.preventDefault();
    const href = anchor.href;
    if (!isSafeUrl(href)) {
      return;
    }
    const route = this.getRoute(href);
    if (route === null) {
      window.location.href = href;
      return;
    }
    this.dialogRef.close();
    this.router.navigateByUrl(route).catch(() => {
      // Not a route of the application after all
      window.location.href = href;
    });
  }

  /**
   * Get the route of the current application a link points to.
   *
   * @param href Absolute url of the link
   * @returns Route, or null if the link is outside of the application
   */
  private getRoute(href: string): string | null {
    const url = new URL(href);
    const origin = window.location.origin;
    if (url.origin !== origin) {
      return null;
    }
    // Path the application is served from, e.g. '/apps/'
    const basePath = new URL(
      this.locationStrategy.getBaseHref() || '/',
      origin
    ).pathname.replace(/\/*$/, '/');
    if (!`${url.pathname}/`.startsWith(basePath)) {
      return null;
    }
    return `/${url.pathname.slice(basePath.length)}${url.search}${url.hash}`;
  }

  /** Close the modal */
  close(): void {
    this.dialogRef.close();
  }
}
