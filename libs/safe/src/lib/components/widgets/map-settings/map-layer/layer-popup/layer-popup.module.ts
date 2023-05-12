import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeDividerModule } from '../../../../ui/divider/divider.module';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { FieldsElementComponent } from './fields-element/fields-element.component';
import { TextElementComponent } from './text-element/text-element.component';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeEditorControlComponent } from '../../../../editor-control/editor-control.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

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
    MatExpansionModule,
    DragDropModule,
    SafeDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    SafeButtonModule,
    SafeIconModule,
    FieldsElementComponent,
    TextElementComponent,
    SafeEditorControlComponent,
    MatTooltipModule,
  ],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
