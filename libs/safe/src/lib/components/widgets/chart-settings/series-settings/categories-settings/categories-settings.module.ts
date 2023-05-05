import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesSettingsComponent } from './categories-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from '@progress/kendo-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { TooltipModule } from '@oort-front/ui';

/**
 * Chart Serie: Categories settings module.
 */
@NgModule({
  declarations: [CategoriesSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    TranslateModule,
    MatSlideToggleModule,
    SafeIconModule,
    TooltipModule,
  ],
  exports: [CategoriesSettingsComponent],
})
export class CategoriesSettingsModule {}
