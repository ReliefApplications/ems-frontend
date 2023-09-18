import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RolesModule } from '@oort-front/shared';

/**
 * Roles page module.
 */
@NgModule({
  declarations: [RolesComponent],
  imports: [CommonModule, RolesRoutingModule, RolesModule],
  exports: [RolesComponent],
})
export class RolesModule {}
