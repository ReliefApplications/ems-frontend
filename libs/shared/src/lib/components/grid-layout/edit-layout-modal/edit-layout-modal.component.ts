import { AfterViewInit, Component, Inject, Input } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
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
import {
  CheckboxModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { LocalizedInputComponent } from '../../controls/public-api';
import {
  LocalizedString,
  resolveLocalizedString,
} from '../../../models/localized-string.model';
import { localizedRequired } from '../../../utils/validators/localizedRequired.validator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    LocalizedInputComponent,
    TranslateModule,
    CheckboxModule,
    IconModule,
    TooltipModule,
  ],
  selector: 'shared-edit-layout-modal',
  templateUrl: './edit-layout-modal.component.html',
  styleUrls: ['./edit-layout-modal.component.scss'],
})
export class EditLayoutModalComponent implements AfterViewInit {
  /**
   * Layout to edit
   */
  @Input() layout: any;
  /**
   * Form
   */
  public form = this.fb.group({
    name: [
      (this.data.layout?.nameTranslations ??
        this.data.layout?.name ??
        '') as LocalizedString,
      localizedRequired,
    ],
    query: createQueryForm(this.data.layout?.query),
    display: createDisplayForm(this.data.layout?.display),
    draft: [this.data.layout?.draft ?? false],
    allDrafts: [this.data.layout?.allDrafts ?? false],
  });
  /**
   * Templates
   */
  public templates: any[] = [];
  /**
   * Layout preview data
   */
  public layoutPreviewData!: { form: UntypedFormGroup; defaultLayout: any };

  /**
   * The constructor function is a special function that is called when a new instance of the class is created
   *
   * @param fb This is the service used to build forms.
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param data This is the data that is passed to the modal when it is opened.
   * @param translate ngx-translate service, used to resolve the active locale on submit.
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditLayoutModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    this.form.get('draft')?.valueChanges.subscribe((draft) => {
      if (!draft) {
        this.form.get('allDrafts')?.setValue(false);
      }
    });
  }

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
   * Splits the localized `name` form value into a plain string (active locale)
   * for the GraphQL `name: String!` input and a per-locale map for `nameTranslations`.
   */
  onSubmit(): void {
    const raw = this.form?.getRawValue() as any;
    const nameValue: LocalizedString = raw?.name ?? '';
    const activeName =
      typeof nameValue === 'string'
        ? nameValue
        : resolveLocalizedString(nameValue, this.translate.currentLang);
    const nameTranslations =
      typeof nameValue === 'string' ? undefined : nameValue;
    this.dialogRef.close({
      name: activeName,
      nameTranslations,
      query: raw.query,
      display: raw.display,
      draft: raw.draft,
      allDrafts: raw.draft ? raw.allDrafts : false,
    } as any);
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
