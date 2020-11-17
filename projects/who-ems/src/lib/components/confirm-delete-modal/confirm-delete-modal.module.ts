import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoConfirmDeleteModalComponent } from './confirm-delete-modal.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';



@NgModule({
  declarations: [WhoConfirmDeleteModalComponent],
  imports: [
    CommonModule, MatDialogModule
  ]
})
export class WhoConfirmDeleteModalModule { }
