import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  IconModule,
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
    MatFormFieldModule,
    FormWrapperModule,
    MatButtonModule,
    MenuModule,
    ReactiveFormsModule,
    IconModule,
    TranslateModule,
    ButtonModule,
    TableModule,
  ],
  exports: [SafeProfileComponent],
})
export class SafeProfileViewModule {}
