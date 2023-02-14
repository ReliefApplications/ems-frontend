import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeDateFilterComponent } from './date-filter.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';

/** DateFilterComponent module. */
@NgModule({
  declarations: [SafeDateFilterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ButtonsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,
    InputsModule,
    DateInputsModule,
  ],
  exports: [SafeDateFilterComponent],
})
export class SafeDateFilterModule {}
