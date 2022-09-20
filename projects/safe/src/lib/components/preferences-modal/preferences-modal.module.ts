import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePreferencesModalComponent } from './preferences-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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
