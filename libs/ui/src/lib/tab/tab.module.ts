import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';

/**
 * UI Tab Module
 */
@NgModule({
  declarations: [TabComponent],
  imports: [CommonModule],
  exports: [TabComponent],
})
export class TabModule {}
