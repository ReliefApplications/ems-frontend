import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';

/** Module for widget choice component */
@NgModule({
  declarations: [SafeWidgetChoiceComponent],
  imports: [CommonModule, MatRippleModule, MatTooltipModule, DragDropModule],
  exports: [SafeWidgetChoiceComponent],
})
export class SafeWidgetChoiceModule {}
