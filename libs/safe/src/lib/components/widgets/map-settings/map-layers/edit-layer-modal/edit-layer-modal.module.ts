import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { SafeMapModule } from '../../../../ui/map/map.module';
import {
  SafeEditLayerModalComponent,
  EditLayerModalComponent,
} from './edit-layer-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { LayerPropertiesComponent } from './layer-properties/layer-properties.component';
import { LayerStylingComponent } from './layer-styling/layer-styling.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeIconPickerModule } from '../../../../ui/icon-picker/icon-picker.module';

/** Module for the SafeEditLayerModalComponent */
@NgModule({
  declarations: [
    SafeEditLayerModalComponent,
    LayerPropertiesComponent,
    LayerStylingComponent,
    EditLayerModalComponent,
  ],
  imports: [
    CommonModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule,
    MatTabsModule,
    MatSelectModule,
    SafeMapModule,
    SafeIconPickerModule,
  ],
  exports: [SafeEditLayerModalComponent],
})
export class SafeEditLayerModalModule {}
