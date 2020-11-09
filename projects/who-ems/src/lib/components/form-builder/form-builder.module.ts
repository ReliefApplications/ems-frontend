import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormBuilderComponent } from './form-builder.component';
import { WhoFormModalModule } from '../form-modal/form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [WhoFormBuilderComponent],
  imports: [
    CommonModule,
    WhoFormModalModule,
    MatDialogModule
  ],
  exports: [WhoFormBuilderComponent]
})
export class WhoFormBuilderModule { }
