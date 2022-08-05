import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeCoreGridModule } from '../../../../ui/core-grid/core-grid.module';
import { SafeValueSelectorTabComponent } from './value-selector-tab.component';

/** Value selector tab module for summary card edition */
@NgModule({
  declarations: [SafeValueSelectorTabComponent],
  imports: [CommonModule, TranslateModule, SafeCoreGridModule],
  exports: [SafeValueSelectorTabComponent],
})
export class SafeValueSelectorTabModule {}
