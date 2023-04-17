import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

/**
 * UI Button Module
 */
@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
