import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerClusterComponent } from './layer-cluster.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from '../../../../icon-picker/icon-picker.module';
import { SimpleRendererComponent } from '../layer-styling/simple-renderer/simple-renderer.component';
import {
  DividerModule,
  FormWrapperModule,
  SliderModule,
  ToggleModule,
} from '@oort-front/ui';

/**
 * layer cluster settings module.
 */
@NgModule({
  declarations: [LayerClusterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    SliderModule,
    ToggleModule,
    IconPickerModule,
    DividerModule,
    SimpleRendererComponent,
  ],
  exports: [LayerClusterComponent],
})
export class LayerClusterModule {}
