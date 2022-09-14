import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmptyComponent } from './empty.component';
import { SafeIconModule } from '../icon/icon.module';

/** Module for the empty indicator component */
@NgModule({
  declarations: [SafeEmptyComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [SafeEmptyComponent],
})
export class SafeEmptyModule {}
