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
import { CommonModule } from '@angular/common';
import { SafeQueryBuilderModule } from '../../query-builder/query-builder.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { SafeModalModule } from '../../ui/modal/modal.module';
import { flattenDeep } from 'lodash';

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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeQueryBuilderModule,
    SafeCoreGridModule,
    SafeModalModule,
  ],
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
    // Remove fields from layout that are not part of the query
    const fieldNames = this.getFieldNames(this.form.getRawValue().query.fields);
    const layoutFields = this.layoutPreviewData.defaultLayout.fields;
    for (const key in layoutFields) {
      if (!fieldNames.includes(key)) {
        delete layoutFields[key];
      }
    }
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

  /**
   * Get field names
   *
   * @param fields list of fields
   * @param prefix field name prefix
   * @returns list of field names
   */
  private getFieldNames(fields: any[], prefix?: string): any[] {
    return flattenDeep(
      fields.map((f) => {
        if (f.fields) {
          return this.getFieldNames(f.fields, f.name);
        } else {
          return prefix ? `${prefix}.${f.name}` : f.name;
        }
      })
    );
  }
}
