import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWidgetChoiceComponent } from './widget-choice.component';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeWidgetChoiceComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    MatTooltipModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
  exports: [SafeWidgetChoiceComponent],
})
export class SafeWidgetChoiceModule {}
