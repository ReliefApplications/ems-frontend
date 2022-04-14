import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMenuComponent } from './upload-menu.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '@safe/builder';

@NgModule({
  declarations: [UploadMenuComponent],
  imports: [CommonModule, UploadModule, TranslateModule, SafeButtonModule],
  exports: [UploadMenuComponent],
})
export class UploadMenuModule {}
