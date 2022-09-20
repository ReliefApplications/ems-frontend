import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SafeProfileModule } from '@safe/builder';

/** Profile module. */
@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, SafeProfileModule],
})
export class ProfileModule {}
