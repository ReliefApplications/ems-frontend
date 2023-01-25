import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerPropertiesComponent } from './layer-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

/** Module for the Layer Properties Component */
@NgModule({
  declarations: [SafeLayerPropertiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    TranslateModule,
    MatSliderModule,
    NgxSliderModule,
  ],
  exports: [SafeLayerPropertiesComponent],
})
export class SafeLayerPropertiesModule {}
