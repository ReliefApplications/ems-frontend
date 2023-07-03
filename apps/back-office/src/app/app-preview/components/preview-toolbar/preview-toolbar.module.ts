import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewToolbarComponent } from './preview-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

/**
 * Toolbar displayed on top of application preview.
 */
@NgModule({
  declarations: [PreviewToolbarComponent],
  imports: [CommonModule, TranslateModule, ButtonModule],
  exports: [PreviewToolbarComponent],
})
export class PreviewToolbarModule {}
