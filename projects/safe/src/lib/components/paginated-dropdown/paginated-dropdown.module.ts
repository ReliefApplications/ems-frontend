import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePaginatedDropdownComponent } from './paginated-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Select module for GraphQL queries.
 */
@NgModule({
  declarations: [SafePaginatedDropdownComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [SafePaginatedDropdownComponent],
})
export class SafePaginatedDropdownModule {}
