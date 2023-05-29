import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletComponent } from './map-clorophlet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MapClorophletDivisionModule } from '../map-clorophlet-division/map-clorophlet-division.module';
import {
  ButtonModule,
  DialogModule,
  TableModule,
  SliderModule,
  FormWrapperModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';

/**
 * Single Clorophlet Configuration in Map Settings Module.
 */
@NgModule({
  declarations: [MapClorophletComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    MatFormFieldModule,
    FormWrapperModule,
    SliderModule,
    MapClorophletDivisionModule,
    ButtonModule,
    TableModule,
    SelectMenuModule,
    SelectOptionModule,
  ],
  exports: [MapClorophletComponent],
})
export class MapClorophletModule {}
