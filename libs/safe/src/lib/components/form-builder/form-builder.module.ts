import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderComponent } from './form-builder.component';
import { DialogModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

/**
 * SafeFormBuilderModule is a class used to manage all the modules and components
 * related to the form builder.
 */
@NgModule({
  declarations: [SafeFormBuilderComponent],
  imports: [CommonModule, DialogModule, TranslateModule, DateInputModule],
  exports: [SafeFormBuilderComponent],
})
export class SafeFormBuilderModule {}
