import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMenuComponent } from './upload-menu.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

/**
 * Upload Menu to be displayed in overlay container.
 * Contains file upload and template download.
 */
@NgModule({
  declarations: [UploadMenuComponent],
  imports: [CommonModule, UploadModule, TranslateModule, ButtonModule],
  exports: [UploadMenuComponent],
})
export class UploadMenuModule {}
