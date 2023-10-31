import { AfterViewInit, Component, Inject, Input } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Layout } from '../../../models/layout.model';
import {
  createDisplayForm,
  createQueryForm,
} from '../../query-builder/query-builder-forms';
import { CommonModule } from '@angular/common';
import { QueryBuilderModule } from '../../query-builder/query-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreGridModule } from '../../ui/core-grid/core-grid.module';
import { flattenDeep } from 'lodash';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule, FormWrapperModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';

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
    FormWrapperModule,
    QueryBuilderModule,
    CoreGridModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'shared-edit-layout-modal',
  templateUrl: './edit-layout-modal.component.html',
  styleUrls: ['./edit-layout-modal.component.scss'],
})
export class EditLayoutModalComponent implements AfterViewInit {
  @Input() layout: any;
  public form = this.fb.group({
    name: [this.data.layout?.name, Validators.required],
    query: createQueryForm(this.data.layout?.query),
    display: createDisplayForm(this.data.layout?.display),
  });
  public templates: any[] = [];
  public layoutPreviewData!: { form: UntypedFormGroup; defaultLayout: any };

  /**
   * The constructor function is a special function that is called when a new instance of the class is created
   *
   * @param fb This is the service used to build forms.
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param data This is the data that is passed to the modal when it is opened.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditLayoutModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  ngAfterViewInit(): void {
    this.layoutPreviewData = {
      form: this.form,
      defaultLayout: this.data.layout?.display,
    };
    // Remove fields from layout that are not part of the query
    const fieldNames = this.getFieldNames(this.form.getRawValue().query.fields);
    if (this.layoutPreviewData.defaultLayout) {
      const layoutFields = this.layoutPreviewData.defaultLayout.fields;
      for (const key in layoutFields) {
        if (!fieldNames.includes(key)) {
          delete layoutFields[key];
        }
      }
    }
    // Subscribe to changes to set display of the query
    this.form.get('display')?.valueChanges.subscribe((value: any) => {
      this.layoutPreviewData.defaultLayout = value;
    });
  }

  /**
   * Closes the modal sending form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form?.getRawValue() as any);
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
