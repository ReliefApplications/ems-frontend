import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePreferencesModalComponent } from './preferences-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * SafePreferencesModalModule is a class used to manage all the modules and components
 * related to the preferences modal
 */
@NgModule({
  declarations: [SafePreferencesModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    SafeModalModule,
  ],
  exports: [SafePreferencesModalComponent],
})
export class SafePreferencesModalModule {}
