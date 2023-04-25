import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [AutocompleteComponent],
})
export class AutocompleteModule {}
