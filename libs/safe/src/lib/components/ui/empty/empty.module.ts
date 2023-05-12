import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmptyComponent } from './empty.component';
import { UiModule } from '@oort-front/ui';

/** Module for the empty indicator component */
@NgModule({
  declarations: [SafeEmptyComponent],
  imports: [CommonModule, UiModule],
  exports: [SafeEmptyComponent],
})
export class SafeEmptyModule {}
