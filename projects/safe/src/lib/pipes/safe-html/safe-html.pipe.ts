import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Pipe for sanitizing html */
@Pipe({ name: 'safeHtml' })
export class SafeSafeHtmlPipe implements PipeTransform {
  /**
   *  Pipe for sanitizing html
   *
   * @param sanitized Angular sanitizer service
   */
  constructor(private sanitized: DomSanitizer) {}

  /**
   * Sanitize the html
   *
   * @param value html to sanitize
   * @returns Sanitized html
   */
  transform(value: string | null | undefined) {
    return this.sanitized.bypassSecurityTrustHtml(value || '');
  }
}
