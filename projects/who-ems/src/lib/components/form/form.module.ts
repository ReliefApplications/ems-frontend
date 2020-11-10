import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoFormModalModule } from '../form-modal/form-modal.module';

@NgModule({
  declarations: [WhoFormComponent],
  imports: [
    CommonModule,
    WhoFormModalModule,
    MatDialogModule
  ],
  exports: [WhoFormComponent]
})
export class WhoFormModule { }
