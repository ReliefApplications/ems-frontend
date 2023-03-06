import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { SafeCardModalComponent } from './card-modal.component';
import { SafeDataSourceTabModule } from './data-source-tab/data-source.module';
import { SafeValueSelectorTabModule } from './value-selector-tab/value-selector.module';
import { SafeDisplayTabModule } from './display-tab/display.module';
import { SafeTextEditorTabModule } from './text-editor-tab/text-editor.module';
import { SafePreviewTabModule } from './preview-tab/preview.module';
import { SafeModalModule } from '../../../ui/modal/modal.module';

/** Card Modal Module */
@NgModule({
  declarations: [SafeCardModalComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    TranslateModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    SafeDataSourceTabModule,
    SafeValueSelectorTabModule,
    SafeDisplayTabModule,
    SafeTextEditorTabModule,
    SafePreviewTabModule,
    SafeModalModule,
  ],
  exports: [SafeCardModalComponent],
})
export class SafeCardModalModule {}
