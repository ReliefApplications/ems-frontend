import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileRoutingModule } from './profile-routing.module';

/**
 * Shared profile page module.
 */
@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    FormWrapperModule,
    MenuModule,
    ReactiveFormsModule,
    IconModule,
    TranslateModule,
    ButtonModule,
    TableModule,
  ],
  exports: [ProfileComponent],
})
export class ProfileViewModule {}
