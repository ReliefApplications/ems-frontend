import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteComponent } from './autocomplete.component';
import { OptionModule } from './components/option.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonModule } from '../button/button.module';

/**
 * UI Autocomplete Module
 */
@NgModule({
  declarations: [AutocompleteDirective, AutocompleteComponent],
  imports: [
    CommonModule,
    OptionModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SpinnerModule,
    ButtonModule,
  ],
  exports: [AutocompleteDirective, AutocompleteComponent, OptionModule],
})
export class AutocompleteModule {}
