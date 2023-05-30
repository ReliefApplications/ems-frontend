import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';

/** Data for the dialog inputs */
interface DialogData {
  title: string;
  value: string;
  readonly?: boolean;
}

/** Component for expanded comments */
@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class SafeExpandedCommentComponent implements OnInit {
  public formControl!: FormControl;

  /**
   * Constructor of this component
   *
   * @param dialogRef The reference to the opened dialog
   * @param data The data inputs for the dialog
   * @param fb Angular form builder
   */
  constructor(
    public dialogRef: MatDialogRef<SafeExpandedCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formControl = this.fb.control({
      value: this.data.value,
      disabled: this.data.readonly || false,
    });
  }
}
