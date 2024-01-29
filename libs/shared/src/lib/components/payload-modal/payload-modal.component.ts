import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@oort-front/ui';

/** Interface of data passed to dialog */
interface DialogData {
  payload: any;
  aggregationPayload?: boolean;
}

/**
 * Data payload modal.
 */
@Component({
  selector: 'app-payload-modal',
  standalone: true,
  imports: [
    DialogModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './payload-modal.component.html',
  styleUrls: ['./payload-modal.component.scss'],
})
export class PayloadModalComponent implements OnInit, OnDestroy {
  /** Monaco editor configuration */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };
  /** Form control to see payload */
  public formControl = new FormControl('');
  /** Timeout listener */
  private timeoutListener!: NodeJS.Timeout;

  /**
   * Reference data and aggregation payload modal.
   *
   * @param dialogRef Dialog ref
   * @param data Data passed to the modal
   */
  constructor(
    public dialogRef: DialogRef<PayloadModalComponent>,
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
      if (this.timeoutListener) {
        clearTimeout(this.timeoutListener);
      }
      this.timeoutListener = setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            this.formControl.markAsPristine();
          });
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
  }
}
