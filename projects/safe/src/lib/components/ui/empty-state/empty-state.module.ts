import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEmptyStateComponent } from './empty-state.component';
import { SafeIconModule } from '../icon/icon.module';

/** Module for the donut chart component */
@NgModule({
  declarations: [SafeEmptyStateComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [SafeEmptyStateComponent],
})
export class SafeEmptyStateModule {}
