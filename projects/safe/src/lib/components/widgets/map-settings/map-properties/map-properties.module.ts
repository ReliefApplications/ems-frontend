import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { SafeMapModule } from '../../map/map.module';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';

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
    MatSliderModule,
    MatTooltipModule,
    MatSelectModule,
    SafeIconModule,
    SafeMapModule,
    SafeButtonModule,
    SafeDividerModule,
  ],
  exports: [MapPropertiesComponent],
})
export class MapPropertiesModule {}
