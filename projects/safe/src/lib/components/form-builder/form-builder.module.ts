import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

/**
 * SafeFormBuilderModule is a class used to manage all the modules and components
 * related to the form builder.
 */
@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatDialogModule,
    DateInputModule,
  ],
  exports: [SafeFormBuilderComponent],
})
export class SafeFormBuilderModule {}
