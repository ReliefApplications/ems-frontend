import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSafeHtmlPipe } from './safe-html.pipe';

/** Pipe for sanitizing html */
@NgModule({
  declarations: [SafeSafeHtmlPipe],
  imports: [CommonModule],
  exports: [SafeSafeHtmlPipe],
})
export class SafeSafeHtmlModule {}
