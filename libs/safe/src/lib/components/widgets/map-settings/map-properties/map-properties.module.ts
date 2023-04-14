import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MapControlsModule } from './map-controls/map-controls.module';
import { WebmapSelectComponent } from './webmap-select/webmap-select.component';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';


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
    SafeButtonModule,
    SafeDividerModule,
    MatCheckboxModule,
    MapControlsModule,
    WebmapSelectComponent,
    SafeGraphQLSelectModule
  ],
  exports: [MapPropertiesComponent],
})
export class MapPropertiesModule {}
