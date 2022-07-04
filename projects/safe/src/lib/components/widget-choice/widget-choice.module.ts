import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

/** Module for widget choice component */
@NgModule({
  declarations: [SafeWidgetChoiceComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatRippleModule,
    MatTooltipModule,
    DragDropModule,
    SafeButtonModule,
  ],
  exports: [SafeWidgetChoiceComponent],
})
export class SafeWidgetChoiceModule {}
