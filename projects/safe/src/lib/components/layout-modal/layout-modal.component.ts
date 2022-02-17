import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createQueryForm } from '../query-builder/query-builder-forms';

// interface DialogData {
//   tile: any;
//   template: any;
// }

@Component({
  selector: 'safe-layout-modal',
  templateUrl: './layout-modal.component.html',
  styleUrls: ['./layout-modal.component.scss'],
})
export class SafeLayoutModalComponent implements OnInit {
  @Input() layout: any;
  public form?: FormGroup;
  private queryName = '';
  public templates: any[] = [];

  get settings(): any {
    return this.form?.getRawValue();
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeLayoutModalComponent> // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      query: createQueryForm(null),
    });
    this.queryName = this.form.get('query')?.value.name;
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
