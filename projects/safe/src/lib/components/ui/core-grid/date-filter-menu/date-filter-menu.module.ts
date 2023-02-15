import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDateFilterMenuComponent } from './date-filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

/**
 * Custom date filter menu for core grids.
 */
@NgModule({
  declarations: [SafeDateFilterMenuComponent],
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
  exports: [SafeDateFilterMenuComponent],
})
export class SafeDateFilterMenuModule {}
