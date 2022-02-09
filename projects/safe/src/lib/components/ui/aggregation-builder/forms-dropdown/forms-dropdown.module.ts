import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormsDropdownComponent } from './forms-dropdown.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeIconModule } from '../../icon/icon.module';

@NgModule({
  declarations: [SafeFormsDropdownComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    SafeIconModule,
  ],
  exports: [SafeFormsDropdownComponent],
})
export class SafeFormsDropdownModule {}
