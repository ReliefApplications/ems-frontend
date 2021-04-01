import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormComponent } from './form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoFormModalModule } from '../form-modal/form-modal.module';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MatTabsModule } from '@angular/material/tabs';
import { WhoSurveyGridModule } from '../survey/survey-grid/survey-grid.module';

@NgModule({
  declarations: [WhoFormComponent],
  imports: [
    CommonModule,
    WhoFormModalModule,
    MatDialogModule,
    DropDownListModule,
    MatTabsModule,
    WhoSurveyGridModule
  ],
  exports: [WhoFormComponent]
})
export class WhoFormModule { }
