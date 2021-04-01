import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoSurveyGridComponent } from './survey-grid.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [WhoSurveyGridComponent],
  imports: [
    CommonModule,
    GridModule,
    GroupModule
  ],
  exports: [WhoSurveyGridComponent]
})
export class WhoSurveyGridModule { }
