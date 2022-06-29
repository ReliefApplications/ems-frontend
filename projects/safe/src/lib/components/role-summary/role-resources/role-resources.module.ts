import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResourcesComponent } from './role-resources.component';

/**
 * Resources tab of Role Summary component.
 */
@NgModule({
  declarations: [RoleResourcesComponent],
  imports: [CommonModule],
  exports: [RoleResourcesComponent],
})
export class RoleResourcesModule {}
