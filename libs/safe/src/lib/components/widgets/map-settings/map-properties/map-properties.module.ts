import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SliderModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@oort-front/ui';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeMapModule } from '../../map/map.module';
import { IconModule } from '@oort-front/ui';

/**
 * Module of Map Properties of Map Widget.
 */
@NgModule({
  declarations: [MapPropertiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    SliderModule,
    TooltipModule,
    MatSelectModule,
    SafeMapModule,
    IconModule,
  ],
  exports: [MapPropertiesComponent],
})
export class MapPropertiesModule {}
