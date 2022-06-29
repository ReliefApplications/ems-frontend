import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridSettingsComponent } from './grid-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeFloatingButtonSettingsComponent } from './floating-button-settings/floating-button-settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutsParametersModule } from '../grid-layout/layouts-parameters/layouts-parameters.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

/** Module for the grid widget settings component */
@NgModule({
  declarations: [
    SafeGridSettingsComponent,
    SafeFloatingButtonSettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    TextFieldModule,
    SafeQueryBuilderModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    SafeButtonModule,
    TranslateModule,
    LayoutsParametersModule,
    MatAutocompleteModule,
    SafeIconModule,
    EditorModule,
  ],
  exports: [SafeGridSettingsComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class SafeGridSettingsModule {}
