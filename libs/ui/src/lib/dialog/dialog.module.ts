import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { DialogCloseDirective } from './dialog-close.directive';

/**
 * UI Dialog Module
 */
@NgModule({
  declarations: [DialogComponent, DialogCloseDirective],
  imports: [CommonModule, DialogCdkModule],
  exports: [DialogComponent, DialogCloseDirective],
})
export class DialogModule {}
