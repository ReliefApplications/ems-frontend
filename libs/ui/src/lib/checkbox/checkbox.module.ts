import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Checkbox Module
 */
@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, TranslateModule],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
