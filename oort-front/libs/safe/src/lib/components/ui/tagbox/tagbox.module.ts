import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTagboxComponent } from './tagbox.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { SafeIconModule } from '../icon/icon.module';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Module declaration for safe-tagbox component
 */
@NgModule({
  declarations: [SafeTagboxComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatChipsModule,
    SafeIconModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [SafeTagboxComponent],
})
export class SafeTagboxModule {}
