import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGraphQLSelectComponent } from './graphql-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeButtonModule } from '../ui/button/button.module';

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
  ],
  exports: [SafeGraphQLSelectComponent],
})
export class SafeGraphQLSelectModule {}
