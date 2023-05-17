import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { MatRippleModule } from '@angular/material/core';
import { TooltipModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

/** Module for widget choice component */
@NgModule({
  declarations: [SafeWidgetChoiceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatRippleModule,
    TooltipModule,
    DragDropModule,
    SafeButtonModule,
    ButtonModule,
  ],
  exports: [SafeWidgetChoiceComponent],
})
export class SafeWidgetChoiceModule {}
