import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/** Data for the dialog inputs */
interface DialogData {
  title: string;
  value: string;
  readonly?: boolean;
}

/**
 * Display full text of long text fields in a modal, and allow edition of the text when possible.
 */
@Component({
  selector: 'safe-expanded-comment',
  templateUrl: './expanded-comment.component.html',
  styleUrls: ['./expanded-comment.component.scss'],
})
export class SafeExpandedCommentComponent implements OnInit {
  /** Form control containing the value */
  public formControl!: UntypedFormControl;

  /**
   * Display full text of long text fields in a modal, and allow edition of the text when possible.
   *
   * @param dialogRef Reference to the opened dialog
   * @param data Dialog data input
   * @param fb Angular form builder
   */
  constructor(
    public dialogRef: DialogRef<SafeExpandedCommentComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.formControl = this.fb.control({
      value: this.data.value,
      disabled: this.data.readonly,
    });
  }
}
