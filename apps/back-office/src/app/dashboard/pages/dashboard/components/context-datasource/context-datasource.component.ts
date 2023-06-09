import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  Resource,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetReferenceDataQueryResponse,
  GetReferenceDatasQueryResponse,
  GetResourceQueryResponse,
  GetResourcesQueryResponse,
  GET_REFERENCE_DATA,
  GET_REFERENCE_DATAS,
  GET_RESOURCE,
  GET_RESOURCES,
} from './graphql/queries';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AlertModule,
  DialogModule,
  TooltipModule,
  GraphQLSelectComponent,
  GraphQLSelectModule,
  IconModule,
} from '@oort-front/ui';

/** Default items per resources query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Create a form group for the page context datasource selection
 *
 * @param data the initial page context
 * @returns the form group
 */
const createContextDatasourceForm = (data?: PageContextT) => {
  const origin =
    data && 'resource' in data ? 'resource' : data ? 'refData' : 'resource';

  return new FormGroup({
    origin: new FormControl<typeof origin>(origin, [Validators.required]),
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
    GraphQLSelectModule,
  ],
  templateUrl: './context-datasource.component.html',
  styleUrls: ['./context-datasource.component.scss'],
})
export class ContextDatasourceComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // Form
  public form!: ReturnType<typeof createContextDatasourceForm>;

  // Data
  public resource: Resource | null = null;
  public refData: ReferenceData | null = null;
  public displayField: string | null = null;

  // Queries
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public refDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;

  @ViewChild(GraphQLSelectComponent)
  resourceSelect?: GraphQLSelectComponent;
  @ViewChild(GraphQLSelectComponent)
  refDataSelect?: GraphQLSelectComponent;

  // Available fields
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
    this.initQueries();

    // When origin changes, reset the other fields
    this.form
      .get('origin')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('resource')?.setValue(null);
        this.form.get('refData')?.setValue(null);
        this.form.get('displayField')?.setValue(null);
      });

    // When resource or refData changes, reset the displayField
    // and update the respective variables values
    (['resource', 'refData'] as const).forEach((field) => {
      this.form
        .get(field)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          // Set displayField to null
          const displayField = this.form.get('displayField');
          displayField?.setValue(null);

          if (value) displayField?.enable();
          else displayField?.disable();

          // Update the respective variables values
          this[field] =
            this[`${field}Select`]?.elements
              .getValue()
              .find((x) => x.id === value) ?? null;

          // Update the displayField options
          this.updateDisplayFieldOptions();
        });
    });

    const sourceSelected =
      !!this.form.get('resource')?.value || !!this.form.get('refData')?.value;

    if (!sourceSelected) this.form.get('displayField')?.disable();
  }

  /** Initializes queries and fetches initial data */
  private initQueries(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.refDatasQuery = this.apollo.watchQuery<GetReferenceDatasQueryResponse>(
      {
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      }
    );

    // If the form has a resource, fetch it
    const resourceID = this.form.get('resource')?.value;
    if (resourceID) {
      this.apollo
        .query<GetResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resourceID,
          },
        })
        .subscribe(({ data }) => {
          this.resource = data.resource;
          this.updateDisplayFieldOptions();
        });
    }

    // If form has a refData, fetch it
    const refDataID = this.form.get('refData')?.value;
    if (refDataID) {
      this.apollo
        .query<GetReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA,
          variables: {
            id: refDataID,
          },
        })
        .subscribe(({ data }) => {
          this.refData = data.referenceData;
          this.updateDisplayFieldOptions();
        });
    }
  }

  /** Updates the options for the display field select */
  private updateDisplayFieldOptions(): void {
    const origin = this.form.get('origin')?.value;

    switch (origin) {
      case 'resource':
        this.availableFields =
          this.resource?.fields.map((x: any) => x.name) ?? [];
        break;
      case 'refData':
        // TODO: When frontend changes about referenceData fields are merged,
        // swap to the commented line to remove any casting
        // this.availableFields = this.refData?.fields?.map((x) => x.name) ?? [];
        this.availableFields =
          this.refData?.fields?.map((x: any) => x.name) ?? [];
        break;
      default:
        this.availableFields = [];
    }
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onResourceSearchChange(search: string): void {
    this.resourcesQuery.refetch({
      first: ITEMS_PER_PAGE,
      sortField: 'name',
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }

  /** Emits the selected context */
  public onSubmit(): void {
    const formValue = this.form.getRawValue();

    const noResource = !this.resource && formValue.origin === 'resource';
    const noRefData = !this.refData && formValue.origin === 'refData';

    if (!formValue.displayField || !formValue.origin || noResource || noRefData)
      return;

    const context: PageContextT =
      formValue.origin === 'resource'
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
}
