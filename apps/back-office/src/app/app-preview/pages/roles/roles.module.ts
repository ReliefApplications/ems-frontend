import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RolesModule as SharedRolesModule } from '@oort-front/shared';

/**
 * Roles page module for application preview.
 */
@NgModule({
  declarations: [RolesComponent],
  imports: [CommonModule, RolesRoutingModule, SharedRolesModule],
  exports: [RolesComponent],
})
export class RolesModule {}
