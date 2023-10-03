import { NgModule } from '@angular/core';
import { DrawerPositionerDirective } from './drawer-positioner.directive';

/** Drawer positioner directive module. */
@NgModule({
  declarations: [DrawerPositionerDirective],
  exports: [DrawerPositionerDirective],
})
export class DrawerPositionerModule {}
