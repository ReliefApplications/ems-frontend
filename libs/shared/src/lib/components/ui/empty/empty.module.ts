import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from './empty.component';
import { IconModule } from '@oort-front/ui';

/** Module for the empty indicator component */
@NgModule({
  declarations: [EmptyComponent],
  imports: [CommonModule, IconModule],
  exports: [EmptyComponent],
})
export class EmptyModule {}
