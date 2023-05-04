import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, DialogCdkModule],
})
export class DialogModule {}
