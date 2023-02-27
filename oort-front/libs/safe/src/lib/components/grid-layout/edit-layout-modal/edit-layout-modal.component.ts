import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { Layout } from '../../../models/layout.model';
import {
  createDisplayForm,
  createQueryForm,
} from '../../query-builder/query-builder-forms';

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
  selector: 'safe-edit-layout-modal',
  templateUrl: './edit-layout-modal.component.html',
  styleUrls: ['./edit-layout-modal.component.scss'],
})
export class SafeEditLayoutModalComponent implements OnInit {
  @Input() layout: any;
  public form?: UntypedFormGroup;
  public templates: any[] = [];
  public layoutPreviewData!: { form: UntypedFormGroup; defaultLayout: any };

  /**
   * The constructor function is a special function that is called when a new instance of the class is created
   *
   * @param formBuilder This is the service used to build forms.
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param data This is the data that is passed to the modal when it is opened.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<SafeEditLayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.data.layout?.name, Validators.required],
      query: createQueryForm(this.data.layout?.query),
      display: createDisplayForm(this.data.layout?.display),
    });
    this.layoutPreviewData = {
      form: this.form,
      defaultLayout: this.data.layout?.display,
    };
    this.form.get('display')?.valueChanges.subscribe((value: any) => {
      this.layoutPreviewData.defaultLayout = value;
    });
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue());
  }
}
