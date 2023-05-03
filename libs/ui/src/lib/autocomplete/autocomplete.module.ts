import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteComponent } from './autocomplete.component';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteDirective, AutocompleteComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AutocompleteDirective, AutocompleteComponent],
})
export class AutocompleteModule {}
