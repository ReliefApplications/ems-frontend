import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { SafeFormsDropdownModule } from '../../ui/aggregation-builder/forms-dropdown/forms-dropdown.module';
import { MatTabsModule } from '@angular/material/tabs';

/** Module for map settings component */
@NgModule({
  declarations: [SafeMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    SafeIconModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    TranslateModule,
    MatTooltipModule,
    SafeFormsDropdownModule,
    MatTabsModule,
  ],
  exports: [SafeMapSettingsComponent],
})
export class SafeMapSettingsModule {}
