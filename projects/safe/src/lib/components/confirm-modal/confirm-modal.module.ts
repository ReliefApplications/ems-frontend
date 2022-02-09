import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeConfirmModalComponent } from './confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SafeConfirmModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class SafeConfirmModalModule {}
