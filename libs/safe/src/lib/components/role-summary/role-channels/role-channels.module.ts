import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleChannelsComponent } from './role-channels.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  SelectMenuModule,
  FixedWrapperModule,
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
    ButtonModule,
    SelectMenuModule,
    FixedWrapperModule,
  ],
  exports: [RoleChannelsComponent],
})
export class RoleChannelsModule {}
