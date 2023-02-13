import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleChannelsComponent } from './role-channels.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatSelectModule } from '@angular/material/select';

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
    SafeButtonModule,
    MatSelectModule,
  ],
  exports: [RoleChannelsComponent],
})
export class RoleChannelsModule {}
