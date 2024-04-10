import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldsElementComponent } from './fields-element/fields-element.component';
import { TextElementComponent } from './text-element/text-element.component';
import { EditorControlComponent } from '../../../../controls/editor-control/editor-control.component';
import {
  ButtonModule,
  DividerModule,
  ExpansionPanelModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  TooltipModule,
  ToggleModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { PortalModule } from '@angular/cdk/portal';

/**
 * Map layer properties popup module.
 */
@NgModule({
  declarations: [LayerPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ExpansionPanelModule,
    DragDropModule,
    DividerModule,
    FormWrapperModule,
    MenuModule,
    ButtonModule,
    IconModule,
    FieldsElementComponent,
    TextElementComponent,
    EditorControlComponent,
    TooltipModule,
    PortalModule,
    ToggleModule,
    SelectMenuModule,
  ],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
