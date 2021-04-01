import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoSurveyGridModule } from '../survey/survey-grid/survey-grid.module';

@NgModule({
  declarations: [WhoFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    WhoSurveyGridModule
  ],
  exports: [WhoFormModalComponent]
})
export class WhoFormModalModule { }
