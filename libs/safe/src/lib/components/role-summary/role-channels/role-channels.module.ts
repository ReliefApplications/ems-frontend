import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleChannelsComponent } from './role-channels.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  ButtonModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';

/**
 * Channels tab of Role Summary.
 */
@NgModule({
  declarations: [RoleChannelsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
  ],
  exports: [RoleChannelsComponent],
})
export class RoleChannelsModule {}
