import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteDirective } from './autocomplete.directive';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteDirective],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AutocompleteDirective],
})
export class AutocompleteModule {}
