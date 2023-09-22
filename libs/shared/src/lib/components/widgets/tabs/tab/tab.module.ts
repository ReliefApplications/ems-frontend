import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { PortalModule } from '@angular/cdk/portal';

/**
 * Tab module, part of tabs widget.
 */
@NgModule({
  declarations: [TabComponent],
  imports: [CommonModule, PortalModule],
  exports: [TabComponent],
})
export class TabModule {}
