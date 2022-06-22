import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Layout } from '../../models/layout.model';
import {
  createDisplayForm,
  createQueryForm,
} from '../query-builder/query-builder-forms';

/**
 * Interface describing the structure of the data displayed in the dialog
 */
interface DialogData {
  layout?: Layout;
  queryName?: string;
}

/**
 * Component used to display modals regarding layouts
 */
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
  public layoutPreviewData!: { form: FormGroup; defaultLayout: any };

  /**
   * The constructor function is a special function that is called when a new instance of the class is created
   *
   * @param formBuilder This is the service used to build forms.
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param data This is the data that is passed to the modal when it is opened.
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SafeLayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.data.layout?.name, Validators.required],
      query: createQueryForm(this.data.layout?.query),
      display: createDisplayForm(this.data.layout?.display),
    });
    this.queryName = this.form.get('query')?.value.name;
    this.layoutPreviewData = {
      form: this.form,
      defaultLayout: this.data.layout?.display,
    };
    this.form.get('display')?.valueChanges.subscribe((value: any) => {
      this.layoutPreviewData.defaultLayout = value;
    });
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
