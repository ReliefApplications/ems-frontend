import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeGraphQLSelectModule } from '../../../../graphql-select/graphql-select.module';
import { SafeFormsDropdownModule } from '../../../../ui/aggregation-builder/public-api';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeDataSourceTabComponent } from './data-source-tab.component';
import { RadioModule, DividerModule, CheckboxModule } from '@oort-front/ui';

/** Data Source tab Module for summary card edition */
@NgModule({
  declarations: [SafeDataSourceTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeFormsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    SafeIconModule,
    MatProgressSpinnerModule,
    SafeGraphQLSelectModule,
    SafeButtonModule,
    CheckboxModule,
    DividerModule,
    RadioModule,
  ],
  exports: [SafeDataSourceTabComponent],
})
export class SafeDataSourceTabModule {}
