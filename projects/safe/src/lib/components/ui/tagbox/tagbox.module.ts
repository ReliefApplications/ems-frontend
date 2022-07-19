import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTagboxComponent } from './tagbox.component';
import { MatChipsModule } from '@angular/material/chips';
import { SafeIconModule } from '../icon/icon.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
