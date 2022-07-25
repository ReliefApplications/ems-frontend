import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePaginatedSelectComponent } from './paginated-select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * SafeFormModule is a class used to manage all the modules and components
 * related to the form display.
 */
@NgModule({
  declarations: [SafePaginatedSelectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [SafePaginatedSelectComponent],
})
export class SafePaginatedSelectModule {}
