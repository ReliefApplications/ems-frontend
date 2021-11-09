import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SafeWidgetChoiceComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatTooltipModule
  ],
  exports: [
    SafeWidgetChoiceComponent
  ]
})
export class SafeWidgetChoiceModule { }
