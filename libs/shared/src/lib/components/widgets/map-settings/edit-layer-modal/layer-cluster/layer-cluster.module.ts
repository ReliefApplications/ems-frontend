import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerClusterComponent } from './layer-cluster.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from '../../../../icon-picker/icon-picker.module';
import { SimpleRendererComponent } from '../layer-styling/simple-renderer/simple-renderer.component';
import {
  ButtonModule,
  DividerModule,
  ExpansionPanelModule,
  FormWrapperModule,
  MenuModule,
  SliderModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextElementComponent } from './text-element/text-element.component';
import { EditorControlComponent } from '../../../../editor-control/editor-control.component';

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
    ButtonModule,
    TooltipModule,
    DragDropModule,
    ExpansionPanelModule,
    MenuModule,
    TextElementComponent,
    EditorControlComponent,
  ],
  exports: [LayerClusterComponent],
})
export class LayerClusterModule {}
