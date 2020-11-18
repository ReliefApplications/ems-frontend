import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoConfirmModalComponent } from './confirm-modal.component';
import {MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [WhoConfirmModalComponent],
  imports: [
    CommonModule, MatDialogModule
  ]
})
export class WhoConfirmModalModule { }
