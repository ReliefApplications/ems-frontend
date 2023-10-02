import { NgModule } from '@angular/core';
import { SafeDrawerPositionerDirective } from './drawer-positioner.directive';

/** Drawer positioner directive module. */
@NgModule({
  declarations: [SafeDrawerPositionerDirective],
  exports: [SafeDrawerPositionerDirective],
})
export class SafeDrawerPositionerModule {}
