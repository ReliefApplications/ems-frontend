import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditLayoutModalComponent } from './edit-layout-modal.component';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { SafeModalModule } from '../../ui/modal/modal.module';

/**
 * Edit layout modal component.
 */
@NgModule({
  declarations: [SafeEditLayoutModalComponent],
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
  exports: [SafeEditLayoutModalComponent],
})
export class SafeEditLayoutModalModule {}
