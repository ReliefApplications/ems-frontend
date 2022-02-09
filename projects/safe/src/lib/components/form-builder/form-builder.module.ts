import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [CommonModule, SafeFormModalModule, MatDialogModule],
  exports: [SafeFormBuilderComponent],
})
export class SafeFormBuilderModule {}
