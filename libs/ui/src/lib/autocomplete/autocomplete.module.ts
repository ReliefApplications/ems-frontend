import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteDirective } from './autocomplete.directive';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [AutocompleteDirective],
})
export class AutocompleteModule {}
