import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoFormModalModule } from '../form-modal/form-modal.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [WhoFormComponent],
  imports: [
    CommonModule,
    WhoFormModalModule,
    MatDialogModule,
    DropDownListModule
  ],
  exports: [WhoFormComponent]
})
export class WhoFormModule { }
