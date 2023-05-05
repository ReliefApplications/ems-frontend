import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

/**
 * UI Dialog Module
 */
@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, DialogCdkModule],
  exports: [DialogComponent],
})
export class DialogModule {}
