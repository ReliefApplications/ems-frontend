import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Sanitize given html string to render in the template
 */
@Pipe({ name: 'sharedSanitizeHtml' })
export class SanitizeHtmlPipe implements PipeTransform {
  /**
   * SanitizeHTML pipe
   *
   * @param {DomSanitizer} _sanitizer Dom sanitizer used to sanitize html value
   */
  constructor(private _sanitizer: DomSanitizer) {}

  /**
   * Transform given string value into a valid sanitized html value
   *
   * @param {string} value html value as string
   * @returns {SafeHtml} sanitized html value
   */
  transform(value: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
