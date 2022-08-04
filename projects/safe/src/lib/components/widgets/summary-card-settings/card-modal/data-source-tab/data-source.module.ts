import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import {
  MatSelectModule,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
} from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutsModule } from '../../../../grid-layout/layouts/layouts.module';
import { SafeFormsDropdownModule } from '../../../../ui/aggregation-builder/public-api';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeDataSourceTabComponent } from './data-source-tab.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

/** Data Source Module */
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
    LayoutsModule,
    MatCheckboxModule,
  ],
  exports: [SafeDataSourceTabComponent],
})
export class SafeDataSourceTabModule {}
