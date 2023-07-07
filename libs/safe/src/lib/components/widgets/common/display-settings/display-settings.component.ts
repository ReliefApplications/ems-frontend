import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToggleModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/** Component for selecting the widget display options */
@Component({
  selector: 'safe-display-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    TranslateModule,
    MonacoEditorModule,
  ],
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss'],
})
export class DisplaySettingsComponent {
  @Input() formGroup!: FormGroup;
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: true,
  };
}
