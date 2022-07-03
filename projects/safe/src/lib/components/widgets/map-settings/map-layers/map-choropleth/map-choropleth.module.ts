import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapChoroplethComponent } from './map-choropleth.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MapChoroplethDivisionModule } from '../map-choropleth-division/map-choropleth-division.module';

/**
 * Single Choropleth layer Configuration in Map Settings Module.
 */
@NgModule({
  declarations: [MapChoroplethComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSliderModule,
    MatSelectModule,
    SafeButtonModule,
    MapChoroplethDivisionModule,
  ],
  exports: [MapChoroplethComponent],
})
export class MapChoroplethModule {}
