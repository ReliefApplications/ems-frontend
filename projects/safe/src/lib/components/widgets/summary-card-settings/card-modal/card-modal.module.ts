import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
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
