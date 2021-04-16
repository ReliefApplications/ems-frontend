import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { WhoSurveyGridModule } from '../survey/survey-grid/survey-grid.module';

@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatDialogModule,
    WhoSurveyGridModule
  ],
  exports: [SafeFormBuilderComponent]
})
export class SafeFormBuilderModule { }
