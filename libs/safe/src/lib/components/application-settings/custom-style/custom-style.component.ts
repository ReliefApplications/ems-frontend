import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'safe-custom-style',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MonacoEditorModule],
  templateUrl: './custom-style.component.html',
  styleUrls: ['./custom-style.component.scss'],
})

/** Component that allow custom styling to the application using free scss editor */
export class CustomStyleComponent {
  public form: UntypedFormGroup = new UntypedFormGroup({});
  @Output() style = new EventEmitter<string>();

  // eslint-disable-next-line prettier/prettier
  public code = 'app-application {\n    color: red !important;\n}';
  public editorOptions = { theme: 'vs-dark', language: 'scss' };

  /**
   * Creates an instance of CustomStyleComponent, form and updates.
   *
   * @param formBuilder Angular form builder
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      style: ['', Validators.required],
    });
    const style = document.createElement('style');
    // Updates the style when the value changes
    this.form.valueChanges.subscribe((value: any) => {
      style.innerText = value.style;
      document.getElementsByTagName('body')[0].appendChild(style);
      this.style.emit(value);
    });
  }
}
