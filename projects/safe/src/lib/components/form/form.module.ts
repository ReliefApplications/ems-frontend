import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeSurveyGridModule } from '../survey/survey-grid/survey-grid.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatDialogModule,
    DropDownListModule,
    MatTabsModule,
    SafeSurveyGridModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [SafeFormComponent]
})
export class SafeFormModule { }
