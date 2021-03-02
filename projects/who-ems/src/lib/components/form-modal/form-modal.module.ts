import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [WhoFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [WhoFormModalComponent]
})
export class WhoFormModalModule { }
