import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { SafeRolesModule } from '@oort-front/safe';

/**
 * Roles page module.
 */
@NgModule({
  declarations: [RolesComponent],
  imports: [CommonModule, RolesRoutingModule, SafeRolesModule],
  exports: [RolesComponent],
})
export class RolesModule {}
