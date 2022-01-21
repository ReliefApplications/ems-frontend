import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeEditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeEditorSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    EditorModule,
    TranslateModule,
  ],
  exports: [SafeEditorSettingsComponent],
})
export class SafeEditorSettingsModule {}
