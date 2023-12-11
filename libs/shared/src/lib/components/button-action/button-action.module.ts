import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonActionComponent } from './button-action.component';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

/**
 *  Button action module.
 */
@NgModule({
  declarations: [ButtonActionComponent],
  imports: [
    CommonModule,
    ButtonModule,
    DragDropModule,
    TooltipModule,
    TranslateModule,
  ],
  exports: [ButtonActionComponent],
})
export class ButtonActionModule {}
