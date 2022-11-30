import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadableCalculatedFieldPipe } from './readable-calculated-field.pipe';

@NgModule({
  declarations: [ReadableCalculatedFieldPipe],
  imports: [CommonModule],
  exports: [ReadableCalculatedFieldPipe],
})
export class SafeReadableCalculatedFieldModule {}
