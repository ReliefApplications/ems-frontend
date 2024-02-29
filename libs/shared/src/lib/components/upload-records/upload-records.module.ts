import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadRecordsComponent } from './upload-records.component';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { UploadMenuModule } from '../upload-menu/upload-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';

/**
 * Upload Records module.
 */
@NgModule({
  declarations: [UploadRecordsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    UploadMenuModule,
    TooltipModule,
    OverlayModule,
  ],
  exports: [UploadRecordsComponent],
})
export class UploadRecordsModule {}
