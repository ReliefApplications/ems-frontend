import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoSurveyGridModule } from '../survey/survey-grid/survey-grid.module';

@NgModule({
  declarations: [SafeFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    WhoSurveyGridModule
  ],
  exports: [SafeFormModalComponent]
})
export class SafeFormModalModule { }
