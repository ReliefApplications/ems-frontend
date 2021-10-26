import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatDialogModule,
    DropDownListModule,
    MatTabsModule,
    SafeButtonModule,
    MatButtonModule
  ],
  exports: [SafeFormComponent]
})
export class SafeFormModule { }
