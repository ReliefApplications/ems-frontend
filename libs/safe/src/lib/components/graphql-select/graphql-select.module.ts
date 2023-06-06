import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGraphQLSelectComponent } from './graphql-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeButtonModule } from '../ui/button/button.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

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
    MatProgressSpinnerModule,
    MatInputModule,
    SafeButtonModule,
    DropDownsModule,
  ],
  exports: [SafeGraphQLSelectComponent],
})
export class SafeGraphQLSelectModule {}
