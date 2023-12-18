import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  PageContextT,
  ReferenceData,
  ReferenceDataQueryResponse,
  Resource,
  UnsubscribeComponent,
  ResourceQueryResponse,
  ResourceSelectComponent,
  ReferenceDataSelectComponent,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AlertModule,
  DialogModule,
  TooltipModule,
  IconModule,
  DividerModule,
} from '@oort-front/ui';

/**
 * Create a form group for the page context datasource selection
 *
 * @param data the initial page context
 * @returns the form group
 */
const createContextDatasourceForm = (data?: PageContextT) => {
  return new FormGroup({
    resource: new FormControl(
      data && 'resource' in data ? data.resource : null
    ),
    refData: new FormControl(data && 'refData' in data ? data.refData : null),
    displayField: new FormControl(
      data && data.displayField ? data.displayField : null,
      [Validators.required]
    ),
  });
};

/** Component for selecting the dashboard context datasource */
@Component({
  selector: 'app-context-datasource',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    IconModule,
    TooltipModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    AlertModule,
    ResourceSelectComponent,
    ReferenceDataSelectComponent,
    DividerModule,
  ],
  templateUrl: './context-datasource.component.html',
  styleUrls: ['./context-datasource.component.scss'],
})
export class ContextDatasourceComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Context form group */
  public form!: ReturnType<typeof createContextDatasourceForm>;
  /** Selected resource */
  public resource: Resource | null = null;
  /** Selected reference data */
  public refData: ReferenceData | null = null;
  /** Current display field */
  public displayField: string | null = null;
  /** Available fields */
  public availableFields: string[] = [];

  /**
   * Component for selecting the dashboard context datasource
   *
   * @param apollo apollo client
   * @param data initial context
   * @param dialogRef dialog reference
   */
  constructor(
    private apollo: Apollo,
    @Inject(DIALOG_DATA) public data: PageContextT,
    public dialogRef: DialogRef<ContextDatasourceComponent>
  ) {
    super();
    this.form = createContextDatasourceForm(data);
  }

  ngOnInit(): void {
    // If the form has a resource, fetch it
    const resourceID = this.form.get('resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }
    // Set subscription of resource
    this.form.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // Set displayField to null
        const displayField = this.form.get('displayField');
        displayField?.setValue(null);

        if (value) {
          this.form.controls.refData.setValue(null);
          this.refData = null;
          displayField?.enable();
          this.getResource(value);
        } else displayField?.disable();
      });

    // If form has a refData, fetch it
    const refDataID = this.form.get('refData')?.value;
    if (refDataID) {
      this.getReferenceData(refDataID);
    }
    // Set subscription of resource
    this.form.controls.refData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // Set displayField to null
        const displayField = this.form.get('displayField');
        displayField?.setValue(null);

        if (value) {
          this.form.controls.resource.setValue(null);
          this.resource = null;
          this.getReferenceData(value);
          displayField?.enable();
        } else displayField?.disable();
      });

    // do the same for ref data

    const sourceSelected =
      !!this.form.get('resource')?.value || !!this.form.get('refData')?.value;

    if (!sourceSelected) this.form.get('displayField')?.disable();
  }

  /**
   * Get reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string) {
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        this.refData = data.referenceData;
        this.updateDisplayFieldOptions();
      });
  }

  /**
   * Get resource by id
   *
   * @param id resource id
   */
  private getResource(id: string) {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        this.resource = data.resource;
        this.updateDisplayFieldOptions();
      });
  }

  /** Updates the options for the display field select */
  private updateDisplayFieldOptions(): void {
    console.log();
    if (this.resource) {
      this.availableFields =
        this.resource?.fields.map((x: any) => x.name) ?? [];
    } else if (this.refData) {
      // TODO: When frontend changes about referenceData fields are merged,
      // swap to the commented line to remove any casting
      // this.availableFields = this.refData?.fields?.map((x) => x.name) ?? [];
      this.availableFields =
        this.refData?.fields?.map((x: any) => x.name) ?? [];
    } else {
      this.availableFields = [];
    }
  }

  /** Emits the selected context */
  public onSubmit(): void {
    const formValue = this.form.getRawValue();

    if (!formValue.displayField || (!formValue.refData && !formValue.resource))
      return;

    const context: PageContextT = formValue.resource
      ? {
          resource: this.resource?.id ?? '',
          displayField: formValue.displayField ?? '',
        }
      : {
          refData: this.refData?.id ?? '',
          displayField: formValue.displayField ?? '',
        };

    this.dialogRef.close(context as any);
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.form.get(formField)?.value) {
      this.form.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
