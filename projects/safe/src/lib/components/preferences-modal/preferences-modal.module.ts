import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePreferencesModalComponent } from './preferences-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

/**
 * SafePreferencesModalModule is a class used to manage all the modules and components
 * related to the preferences modal
 */
@NgModule({
  declarations: [SafePreferencesModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SafeButtonModule,
    SafeIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatSelectModule,
    MatTabsModule,
  ],
  exports: [SafePreferencesModalComponent],
})
export class SafePreferencesModalModule {}
