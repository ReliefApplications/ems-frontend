import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldDropdownComponent } from './field-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../ui/icon/icon.module';

/**
 * Fields dropdown module.
 */
@NgModule({
  declarations: [FieldDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    SafeIconModule,
  ],
  exports: [FieldDropdownComponent],
})
export class FieldDropdownModule {}
