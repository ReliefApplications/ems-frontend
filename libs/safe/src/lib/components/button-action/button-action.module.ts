import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonActionComponent } from './button-action.component';
import { ButtonModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 *  Button action module.
 */
@NgModule({
  declarations: [ButtonActionComponent],
  imports: [CommonModule, ButtonModule, DragDropModule],
  exports: [ButtonActionComponent],
})
export class ButtonActionModule {}
