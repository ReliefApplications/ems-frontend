import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavDirective } from './sidenav.directive';
import { SidenavContainerComponent } from './sidenav-container.component';

/**
 * UI Sidenav module
 */
@NgModule({
  declarations: [SidenavDirective, SidenavContainerComponent],
  imports: [CommonModule],
  exports: [SidenavDirective, SidenavContainerComponent],
})
export class SidenavContainerModule {}
