import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetChoiceComponent } from './widget-choice.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule } from '@oort-front/ui';

/** Module for widget choice component */
@NgModule({
  declarations: [WidgetChoiceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TooltipModule,
    DragDropModule,
    ButtonModule,
  ],
  exports: [WidgetChoiceComponent],
})
export class WidgetChoiceModule {}
