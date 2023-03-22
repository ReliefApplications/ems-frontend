import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SafeButtonModule } from '@oort-front/safe';

const DEFAULT_STYLE = 'app-application {\n    color: red !important;\n}';

@Component({
  selector: 'app-custom-style',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    SafeButtonModule,
  ],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})

/** Component that allow custom styling to the application using free scss editor */
export class CustomStyleComponent {
  public formControl = new FormControl(DEFAULT_STYLE);
  @Output() style = new EventEmitter<string>();
  @Output() cancel = new EventEmitter();
  public editorOptions = {
    theme: 'vs-dark',
    language: 'scss',
    fixedOverflowWidgets: true,
  };

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   */
  constructor() {
    const style = document.createElement('style');
    // Updates the style when the value changes
    this.formControl.valueChanges.subscribe((value: any) => {
      console.log('change');
      style.innerText = value;
      document.getElementsByTagName('body')[0].appendChild(style);
      this.style.emit(value);
    });
  }

  onClose(): void {
    this.cancel.emit(true);
  }
}
