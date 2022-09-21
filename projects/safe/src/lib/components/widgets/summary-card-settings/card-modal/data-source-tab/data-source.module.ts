import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { SafeGraphQLSelectModule } from '../../../../graphql-select/graphql-select.module';
import { AddLayoutModalModule } from '../../../../grid-layout/add-layout-modal/add-layout-modal.module';
import { SafeFormsDropdownModule } from '../../../../ui/aggregation-builder/public-api';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeDataSourceTabComponent } from './data-source-tab.component';

/** Data Source tab Module for summary card edition */
@NgModule({
  declarations: [SafeDataSourceTabComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatRadioModule,
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
    AddLayoutModalModule,
  ],
  exports: [SafeDataSourceTabComponent],
})
export class SafeDataSourceTabModule {}
