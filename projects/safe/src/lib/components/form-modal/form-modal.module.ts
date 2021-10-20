import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../ui/button/button.module';

@NgModule({
  declarations: [SafeFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SafeButtonModule
  ],
  exports: [SafeFormModalComponent]
})
export class SafeFormModalModule { }
