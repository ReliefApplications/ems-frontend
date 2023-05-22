import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmptyComponent } from './empty.component';
import { IconModule } from '@oort-front/ui';

/** Module for the empty indicator component */
@NgModule({
  declarations: [SafeEmptyComponent],
  imports: [CommonModule, IconModule],
  exports: [SafeEmptyComponent],
})
export class SafeEmptyModule {}
