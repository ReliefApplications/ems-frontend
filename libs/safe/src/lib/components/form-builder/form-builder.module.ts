import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

/**
 * SafeFormBuilderModule is a class used to manage all the modules and components
 * related to the form builder.
 */
@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [CommonModule, MatDialogModule, TranslateModule, DateInputModule],
  exports: [SafeFormBuilderComponent],
})
export class SafeFormBuilderModule {}
