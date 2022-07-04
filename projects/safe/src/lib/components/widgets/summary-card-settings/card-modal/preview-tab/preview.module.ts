import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafePreviewTabComponent } from './preview-tab.component';

/** Data Source Module */
@NgModule({
  declarations: [SafePreviewTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [SafePreviewTabComponent],
})
export class SafePreviewTabModule {}
