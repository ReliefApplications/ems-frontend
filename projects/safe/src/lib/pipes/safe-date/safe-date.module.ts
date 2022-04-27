import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDatePipe } from './safe-date.pipe';

@NgModule({
  declarations: [SafeDatePipe],
  imports: [CommonModule],
  exports: [SafeDatePipe],
})
export class SafeDateModule {}
