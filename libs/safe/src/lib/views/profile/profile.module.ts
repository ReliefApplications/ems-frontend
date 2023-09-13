import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeProfileRoutingModule } from './profile-routing.module';

/**
 * Shared profile page module.
 */
@NgModule({
  declarations: [SafeProfileComponent],
  imports: [
    CommonModule,
    SafeProfileRoutingModule,
    FormsModule,
    FormWrapperModule,
    MenuModule,
    ReactiveFormsModule,
    IconModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    TooltipModule,
  ],
  exports: [SafeProfileComponent],
})
export class SafeProfileViewModule {}
