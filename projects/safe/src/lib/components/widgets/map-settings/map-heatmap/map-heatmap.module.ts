import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapHeatmapComponent } from './map-heatmap.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeMapModule } from '../../map/map.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';

/** Module for the MapHeatmapComponent */
@NgModule({
  declarations: [MapHeatmapComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatTooltipModule,
    MatSlideToggleModule,
    SafeIconModule,
    SafeMapModule,
    SafeDividerModule,
  ],
  exports: [MapHeatmapComponent],
})
export class MapHeatmapModule {}
