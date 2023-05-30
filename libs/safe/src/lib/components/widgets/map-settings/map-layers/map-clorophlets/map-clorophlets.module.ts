import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClorophletsComponent } from './map-clorophlets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapClorophletModule } from '../map-clorophlet/map-clorophlet.module';
import { AlertModule, ButtonModule } from '@oort-front/ui';
import { TableModule } from '@oort-front/ui';

/**
 * List of clorophlets in Map Settings Module.
 */
@NgModule({
  declarations: [MapClorophletsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MapClorophletModule,
    ButtonModule,
    TableModule,
    AlertModule,
  ],
  exports: [MapClorophletsComponent],
})
export class MapClorophletsModule {}
