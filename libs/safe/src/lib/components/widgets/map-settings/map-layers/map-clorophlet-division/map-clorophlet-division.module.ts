import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletDivisionComponent } from './map-clorophlet-division.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { ButtonModule, FormWrapperModule, DialogModule } from '@oort-front/ui';

/**
 * Single Division of clorophlet configuration module.
 */
@NgModule({
  declarations: [MapClorophletDivisionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    FormWrapperModule,
    SafeFilterModule,
    ButtonModule,
  ],
  exports: [MapClorophletDivisionComponent],
})
export class MapClorophletDivisionModule {}
