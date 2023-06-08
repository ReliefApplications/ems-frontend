import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ButtonModule } from '@oort-front/ui';

/** Module for widget choice component */
@NgModule({
  declarations: [SafeWidgetChoiceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TooltipModule,
    DragDropModule,
    ButtonModule,
  ],
  exports: [SafeWidgetChoiceComponent],
})
export class SafeWidgetChoiceModule {}
