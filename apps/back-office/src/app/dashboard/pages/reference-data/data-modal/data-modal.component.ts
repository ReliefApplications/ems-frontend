import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@oort-front/ui';

/**
 * Modal for referenceData data
 */
@Component({
  selector: 'app-data-modal',
  standalone: true,
  imports: [
    DialogModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.scss'],
})
export class DataModalComponent implements OnInit {
  /** Monaco editor configuration, for raw edition */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  public formControl = new FormControl('');

  /**
   * Creates an instance of DataModalComponent.
   *
   * @param dialogRef dialog ref
   * @param data injected modal data
   * @param data.jsonData jsonData from referenceData
   */
  constructor(
    public dialogRef: DialogRef<DataModalComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      jsonData: any;
    }
  ) {}

  ngOnInit(): void {
    this.formControl.setValue(JSON.stringify(this.data.jsonData));
  }

  /**
   * On initialization of editor, format code
   *
   * @param editor monaco editor used for json edition
   */
  public initEditor(editor: any): void {
    if (editor) {
      setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            this.formControl.markAsPristine();
          });
      }, 100);
    }
  }
}
