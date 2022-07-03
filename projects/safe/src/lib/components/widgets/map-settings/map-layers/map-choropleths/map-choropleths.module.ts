import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapChoroplethsComponent } from './map-choropleths.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { MatTableModule } from '@angular/material/table';
import { MapChoroplethModule } from '../map-choropleth/map-choropleth.module';

/**
 * List of choropleth layers in Map Settings Module.
 */
@NgModule({
  declarations: [MapChoroplethsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SafeButtonModule,
    SafeIconModule,
    SafeAlertModule,
    MatTableModule,
    MapChoroplethModule,
  ],
  exports: [MapChoroplethsComponent],
})
export class MapChoroplethsModule {}
