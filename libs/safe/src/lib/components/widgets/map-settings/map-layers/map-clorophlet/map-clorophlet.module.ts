import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletComponent } from './map-clorophlet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapClorophletDivisionModule } from '../map-clorophlet-division/map-clorophlet-division.module';
import {
  ButtonModule,
  DialogModule,
  TableModule,
  SliderModule,
  FormWrapperModule,
  SelectMenuModule,
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
    FormWrapperModule,
    SliderModule,
    MapClorophletDivisionModule,
    ButtonModule,
    TableModule,
    SelectMenuModule,
  ],
  exports: [MapClorophletComponent],
})
export class MapClorophletModule {}
