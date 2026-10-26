import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FieldsElementComponent } from './fields-element/fields-element.component';
import { TextElementComponent } from './text-element/text-element.component';
import {
  ButtonModule,
  DividerModule,
  ExpansionPanelModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { PortalModule } from '@angular/cdk/portal';
import { LocalizedInputComponent } from '../../../../controls/public-api';
import { LocalizePipe } from '../../../../../pipes/localize/localize.pipe';

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
    LocalizedInputComponent,
    LocalizePipe,
    TooltipModule,
    PortalModule,
  ],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
