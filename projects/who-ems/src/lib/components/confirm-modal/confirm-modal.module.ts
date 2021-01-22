import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoConfirmModalComponent } from './confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [WhoConfirmModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class WhoConfirmModalModule { }
