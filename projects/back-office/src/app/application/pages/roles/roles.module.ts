import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { WhoRolesModule } from '@who-ems/builder';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    WhoRolesModule
  ],
  exports: [RolesComponent]
})
export class RolesModule { }
