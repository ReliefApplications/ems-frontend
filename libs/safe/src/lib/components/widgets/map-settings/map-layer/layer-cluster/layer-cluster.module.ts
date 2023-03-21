import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerClusterComponent } from './layer-cluster.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { IconPickerModule } from '../../../../icon-picker/icon-picker.module';
import { SafeDividerModule } from '../../../../ui/divider/divider.module';

/**
 * layer cluster settings module.
 */
@NgModule({
  declarations: [LayerClusterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    IconPickerModule,
    SafeDividerModule,
  ],
  exports: [LayerClusterComponent],
})
export class LayerClusterModule {}
