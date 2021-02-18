import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoFormModalModule } from '../form-modal/form-modal.module';
import { MatTooltipModule } from '@angular/material/tooltip';

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
