import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutModalComponent } from './layout-modal.component';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { SafeModalModule } from '../../ui/modal/modal.module';

/**
 * SafeLayoutModalModule is a class used to manage all the modules and components
 * related to the layout modals.
 */
@NgModule({
  declarations: [SafeLayoutModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeQueryBuilderModule,
    SafeCoreGridModule,
    SafeModalModule,
  ],
  exports: [SafeLayoutModalComponent],
})
export class SafeLayoutModalModule {}
