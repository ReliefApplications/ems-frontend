import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ApiConfiguration,
  Application,
  Channel,
  Form,
  PullJob,
  status,
  authType,
  cronValidator,
  ApplicationsApplicationNodesQueryResponse,
  ApiConfigurationsQueryResponse,
  FormQueryResponse,
  FormsQueryResponse,
  StatusOptionsComponent,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GET_API_CONFIGURATIONS,
  GET_SHORT_FORM_BY_ID,
  GET_FORM_NAMES,
  GET_ROUTING_KEYS,
} from '../../graphql/queries';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import get from 'lodash/get';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../../../utils/update-queries';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ReadableCronModule,
  CronExpressionControlModule,
} from '@oort-front/shared';
import {
  TooltipModule,
  ButtonModule,
  ExpansionPanelModule,
  SelectMenuModule,
  FormWrapperModule,
  TextareaModule,
  GraphQLSelectModule,
  IconModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/** Items per page for pagination */
const ITEMS_PER_PAGE = 10;

/** Default fields */
const DEFAULT_FIELDS = ['createdBy'];

/** Pull job modal component */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    GraphQLSelectModule,
    ReadableCronModule,
    TooltipModule,
    ExpansionPanelModule,
    CronExpressionControlModule,
    IconModule,
    TextareaModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    StatusOptionsComponent,
    MonacoEditorModule,
  ],
  selector: 'app-edit-pull-job-modal',
  templateUrl: './edit-pull-job-modal.component.html',
  styleUrls: ['./edit-pull-job-modal.component.scss'],
})
export class EditPullJobModalComponent implements OnInit {
  // === REACTIVE FORM ===
  public formGroup = this.fb.group({
    name: [get(this.data, 'pullJob.name', ''), Validators.required],
    status: [get(this.data, 'pullJob.status', ''), Validators.required],
    apiConfiguration: [
      get(this.data, 'pullJob.apiConfiguration.id', ''),
      Validators.required,
    ],
    url: [get(this.data, 'pullJob.url', '')],
    path: [get(this.data, 'pullJob.path', '')],
    schedule: [
      get(this.data, 'pullJob.schedule', ''),
      [Validators.required, cronValidator()],
    ],
    convertTo: [get(this.data, 'pullJob.convertTo.id', '')],
    channel: [get(this.data, 'pullJob.channel.id', '')],
    mapping: this.fb.array(
      this.data.pullJob && this.data.pullJob.mapping
        ? Object.keys(this.data.pullJob.mapping).map((x: any) =>
            this.fb.group({
              name: [x, Validators.required],
              value: [this.data.pullJob?.mapping[x], Validators.required],
            })
          )
        : []
    ),
    rawMapping: [
      this.data.pullJob && this.data.pullJob.mapping
        ? JSON.stringify(this.data.pullJob?.mapping, null, 2)
        : '',
    ],
    uniqueIdentifiers: [get(this.data, 'pullJob.uniqueIdentifiers', [])],
  });
  isHardcoded = true;

  // === FORMS ===
  public formsQuery!: QueryRef<FormsQueryResponse>;

  // === CHANNELS ===
  private applicationsLoading = true;
  public applications = new BehaviorSubject<Application[]>([]);
  public applications$!: Observable<Application[]>;
  private cachedApplications: Application[] = [];
  private applicationsQuery!: QueryRef<ApplicationsApplicationNodesQueryResponse>;
  private applicationsPageInfo = {
    endCursor: '',
    hasNextPage: true,
  };

  // === API ===
  public apiConfigurations: ApiConfiguration[] = [];
  public apiConfigurationsQuery!: QueryRef<ApiConfigurationsQueryResponse>;

  // === DATA ===
  public statusChoices = Object.values(status);
  public fields: any[] = [];
  private fieldsSubscription?: Subscription;

  // === RAW JSON UTILITY ===
  public openRawJSON = false;

  /** @returns pull job mapping as form array */
  get mappingArray(): UntypedFormArray {
    return this.formGroup.get('mapping') as UntypedFormArray;
  }

  /** @returns default API configuration */
  get defaultApiConfiguration(): ApiConfiguration | null {
    return this.data.pullJob?.apiConfiguration || null;
  }

  /** @returns default convert to form */
  get defaultForm(): Form | null {
    return this.data.pullJob?.convertTo || null;
  }

  /** @returns default channel */
  get defaultChannel(): Channel | null {
    return this.data.pullJob?.channel || null;
  }

  /** Monaco editor configuration, for raw edition */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: true,
  };

  /**
   * Pull job modal component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Apollo service
   * @param document Document
   * @param data Modal injected data
   * @param data.channels list of available channels
   * @param data.pullJob pull job
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditPullJobModalComponent>,
    private apollo: Apollo,
    @Inject(DOCUMENT) private document: Document,
    @Inject(DIALOG_DATA)
    public data: {
      channels: Channel[];
      pullJob?: PullJob;
    }
  ) {}

  ngOnInit(): void {
    this.formsQuery = this.apollo.watchQuery<FormsQueryResponse>({
      query: GET_FORM_NAMES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.apiConfigurationsQuery =
      this.apollo.watchQuery<ApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
    this.apiConfigurationsQuery.valueChanges.subscribe(
      ({ data }) =>
        (this.apiConfigurations = data.apiConfigurations.edges.map(
          (x) => x.node
        ))
    );

    // Fetch form fields if any for mapping
    if (this.data.pullJob?.convertTo?.id) {
      this.getFields(this.data.pullJob?.convertTo.id);
    }
    this.formGroup.get('convertTo')?.valueChanges.subscribe((res) => {
      if (res) {
        this.getFields(res);
      }
    });

    // Fetch the applications to get the channels
    this.applicationsQuery =
      this.apollo.watchQuery<ApplicationsApplicationNodesQueryResponse>({
        query: GET_ROUTING_KEYS,
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.applicationsPageInfo.endCursor,
        },
      });

    // this.applications$ = this.applications.asObservable();
    this.applicationsQuery.valueChanges.subscribe(({ data, loading }) => {
      this.updateValues(data, loading);
    });

    // Set boolean to allow additional fields if it's not isHardcoded
    this.isHardcoded = !(
      this.data.pullJob &&
      this.data.pullJob.apiConfiguration &&
      this.data.pullJob.apiConfiguration.authType &&
      this.data.pullJob.apiConfiguration.authType === authType.public
    );
    this.formGroup
      .get('apiConfiguration')
      ?.valueChanges.subscribe((apiConfiguration: string | null) => {
        if (apiConfiguration) {
          const api = this.apiConfigurations.find(
            (x) => x.id === apiConfiguration
          );
          this.isHardcoded = !(
            api &&
            api.authType &&
            api.authType === authType.public
          );
        }
      });

    this.formGroup
      .get('rawMapping')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        const mapping = JSON.parse(value || '{}');
        this.formGroup.setControl(
          'mapping',
          this.fb.array(
            Object.keys(mapping).map((x: any) =>
              this.fb.group({
                name: [x, Validators.required],
                value: [mapping[x], Validators.required],
              })
            )
          )
        );
      });
  }

  /**
   * Get fields from form id.
   *
   * @param id Id of selected form.
   */
  private getFields(id: string): void {
    if (this.fieldsSubscription) {
      this.fieldsSubscription.unsubscribe();
    }
    this.fieldsSubscription = this.apollo
      .watchQuery<FormQueryResponse>({
        query: GET_SHORT_FORM_BY_ID,
        variables: {
          id,
        },
      })
      .valueChanges.subscribe((resForm) => {
        if (resForm.data.form) {
          this.fields = resForm.data.form.fields || [];
          this.fields = this.fields.concat(
            DEFAULT_FIELDS.map((x) => ({ name: x }))
          );
        }
      });
  }

  /**
   * Filters fields so we cannot add a multiple mapping for the same one.
   *
   * @param name Field name.
   * @returns Filtered fields.
   */
  public filteredFields(name: string): any[] {
    return this.fields.filter(
      (field) =>
        field.name === name ||
        !this.formGroup.value.mapping?.some((x: any) => x.name === field.name)
    );
  }

  /**
   * Removes element from the mapping
   *
   * @param index mapping element index.
   */
  onDeleteElement(index: number): void {
    this.mappingArray.removeAt(index);
  }

  /**
   * Adds new element to the mapping.
   */
  onAddElement(): void {
    this.mappingArray.push(
      this.fb.group({
        name: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  /**
   * Toggles the edit mode and update form values accordingly.
   */
  toggleRawJSON(): void {
    this.synchronizeFormValueData();
    this.openRawJSON = !this.openRawJSON;
  }

  /**
   * Synchronize mapping of the form value to the raw mapping if user don't want to open raw JSON
   */
  private synchronizeFormValueData() {
    if (!this.openRawJSON) {
      const mapping = this.formGroup
        .get('mapping')
        ?.value.reduce(
          (o: any, field: any) => ({ ...o, [field.name]: field.value }),
          {}
        );
      this.formGroup
        .get('rawMapping')
        ?.setValue(JSON.stringify(mapping, null, 2));
    }
  }

  /**
   * Synchronizes mapping values on update button click.
   *
   * @returns Return form value.
   */
  returnFormValue(): any {
    this.synchronizeFormValueData();
    return this.formGroup.value;
  }

  /**
   * Adds scroll listener to channels select.
   */
  onOpenApplicationSelect(): void {
    const panel = this.document.getElementById('optionList');
    if (panel) {
      panel.onscroll = (event: any) => this.loadOnScrollApplication(event);
    }
  }

  /**
   * Fetches more channels on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScrollApplication(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.applicationsLoading && this.applicationsPageInfo.hasNextPage) {
        this.applicationsLoading = true;
        const variables = {
          first: ITEMS_PER_PAGE,
          afterCursor: this.applicationsPageInfo.endCursor,
        };
        const cachedValues: ApplicationsApplicationNodesQueryResponse =
          getCachedValues(this.apollo.client, GET_ROUTING_KEYS, variables);
        if (cachedValues) {
          this.updateValues(cachedValues, false);
        } else {
          this.applicationsQuery
            .fetchMore({
              variables,
            })
            .then((results) =>
              this.updateValues(results.data, results.loading)
            );
        }
      }
    }
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onFormSearchChange(search: string): void {
    const variables = this.formsQuery.variables;
    this.formsQuery.refetch({
      ...variables,
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

  /**
   * Update application data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(
    data: ApplicationsApplicationNodesQueryResponse,
    loading: boolean
  ) {
    const nodes = data.applications.edges
      .map((x) => x.node)
      .filter((x) => (x.channels ? x.channels.length > 0 : false));
    this.cachedApplications = updateQueryUniqueValues(
      this.cachedApplications,
      nodes
    );
    this.applications.next(this.cachedApplications);
    this.applicationsPageInfo = data.applications.pageInfo;
    this.applicationsLoading = loading;
  }
}
