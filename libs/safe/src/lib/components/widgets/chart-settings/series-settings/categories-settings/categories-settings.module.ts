import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesSettingsComponent } from './categories-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';

/**
 *
 */
@NgModule({
  declarations: [CategoriesSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    TranslateModule,
  ],
  exports: [CategoriesSettingsComponent],
})
export class CategoriesSettingsModule {}
