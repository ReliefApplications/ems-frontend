import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { WhoProfileModule } from '@who-ems/builder';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    WhoProfileModule
  ]
})
export class ProfileModule { }
