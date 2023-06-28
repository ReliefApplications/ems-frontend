import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteComponent } from './autocomplete.component';
import { OptionModule } from './components/option.module';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteDirective, AutocompleteComponent],
  imports: [CommonModule, OptionModule],
  exports: [AutocompleteDirective, AutocompleteComponent, OptionModule],
})
export class AutocompleteModule {}
