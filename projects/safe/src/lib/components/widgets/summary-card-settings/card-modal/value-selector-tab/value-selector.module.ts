import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeValueSelectorTabComponent } from './value-selector-tab.component';

/** Data Source Module */
@NgModule({
  declarations: [SafeValueSelectorTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [SafeValueSelectorTabComponent],
})
export class SafeValueSelectorTabModule {}
