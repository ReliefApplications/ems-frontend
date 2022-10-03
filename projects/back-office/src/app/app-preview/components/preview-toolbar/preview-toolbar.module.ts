import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewToolbarComponent } from './preview-toolbar.component';
import { SafeButtonModule, SafeDividerModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Toolbar displayed on top of application preview.
 */
@NgModule({
  declarations: [PreviewToolbarComponent],
  imports: [CommonModule, SafeDividerModule, SafeButtonModule, TranslateModule],
  exports: [PreviewToolbarComponent],
})
export class PreviewToolbarModule {}
