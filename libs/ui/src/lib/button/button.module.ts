import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './button.component';

/**
 * UI Button Module
 */
@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, TranslateModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
