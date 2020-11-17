import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';



@NgModule({
  declarations: [ConfirmDeleteModalComponent],
  imports: [
    CommonModule, MatDialogModule
  ]
})
export class ConfirmDeleteModalModule { }
