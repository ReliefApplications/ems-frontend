import { NgModule } from '@angular/core';
import { ModernDrawerPositionerDirective } from './modern-drawer-positioner.directive';

/**
 * Drawer positioner module for modern variant of dashboard filter.
 */
@NgModule({
  declarations: [ModernDrawerPositionerDirective],
  exports: [ModernDrawerPositionerDirective],
})
export class ModernDrawerPositionerModule {}
