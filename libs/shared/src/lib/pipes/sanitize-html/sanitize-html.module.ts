import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

/**
 * Sanitize HTML module.
 * Include pipe to set sanitize the needed html string value in the template
 */
@NgModule({
  declarations: [SanitizeHtmlPipe],
  imports: [CommonModule],
  exports: [SanitizeHtmlPipe],
})
export class SanitizeHTMLModule {}
