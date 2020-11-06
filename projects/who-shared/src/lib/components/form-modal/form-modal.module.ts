import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [WhoFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [WhoFormModalComponent]
})
export class WhoFormModalModule { }
