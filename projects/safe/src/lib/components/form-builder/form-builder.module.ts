import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatDialogModule,
    TranslateModule,
  ],
  exports: [SafeFormBuilderComponent],
})
export class SafeFormBuilderModule {}
