import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGraphQLSelectComponent } from './graphql-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SpinnerModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  ButtonModule,
  SelectMenuModule,
  SelectOptionModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Select module for GraphQL queries.
 */
@NgModule({
  declarations: [SafeGraphQLSelectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatInputModule,
    ButtonModule,
    SelectMenuModule,
    SelectOptionModule,
    FormWrapperModule,
  ],
  exports: [SafeGraphQLSelectComponent],
})
export class SafeGraphQLSelectModule {}
