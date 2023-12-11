import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@oort-front/ui';

/** Interface of data passed to dialog */
interface DialogData {
  payload: any;
}

/**
 * Reference data payload modal.
 */
@Component({
  selector: 'app-reference-data-payload-modal',
  standalone: true,
  imports: [
    DialogModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './reference-data-payload-modal.component.html',
  styleUrls: ['./reference-data-payload-modal.component.scss'],
})
export class ReferenceDataPayloadModalComponent implements OnInit {
  /** Monaco editor configuration */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  /** Form control to see payload */
  public formControl = new FormControl('');

  /**
   * Reference data payload modal.
   *
   * @param dialogRef Dialog ref
   * @param data Data passed to the modal
   */
  constructor(
    public dialogRef: DialogRef<ReferenceDataPayloadModalComponent>,
    @Inject(DIALOG_DATA)
    public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.data.payload) {
      this.formControl.setValue(JSON.stringify(this.data.payload));
    }
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
