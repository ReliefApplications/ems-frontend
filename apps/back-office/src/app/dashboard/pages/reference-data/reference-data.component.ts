import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiConfiguration,
  ReferenceData,
  referenceDataType,
  BreadcrumbService,
  UnsubscribeComponent,
  ReferenceDataService,
  ApiConfigurationsQueryResponse,
  ReferenceDataQueryResponse,
  ApiConfigurationQueryResponse,
  EditReferenceDataMutationResponse,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import { EDIT_REFERENCE_DATA } from './graphql/mutations';
import {
  GET_API_CONFIGURATION,
  GET_API_CONFIGURATIONS_NAMES,
  GET_REFERENCE_DATA,
} from './graphql/queries';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { takeUntil } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inferTypeFromString } from './utils/inferTypeFromString';
import { get } from 'lodash';
import { SnackbarService, TextareaComponent } from '@oort-front/ui';
import { GraphQLError } from 'graphql';

/** Default graphql query */
const DEFAULT_QUERY = `query {\n  \n}`;
/** Default pagination parameter. */
const ITEMS_PER_PAGE = 10;
/** Available separator for csv */
const SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

/**
 * Reference data page.
 */
@Component({
  selector: 'app-reference-data',
  templateUrl: './reference-data.component.html',
  styleUrls: ['./reference-data.component.scss'],
})
export class ReferenceDataComponent
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public id = '';
  public referenceData?: ReferenceData;

  // === FORM ===
  public referenceForm!: ReturnType<typeof this.getRefDataForm>;
  public referenceTypeChoices = Object.values(referenceDataType);

  public selectedApiConfiguration?: ApiConfiguration;
  public apiConfigurationsQuery!: QueryRef<ApiConfigurationsQueryResponse>;

  public valueFields: NonNullable<ReferenceData['fields']> = [];
  public triedToGetFields = false;
  public loadingFields = false;
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  // === CSV ===
  public csvValue = '';
  public newData: any = [];
  public csvLoading = false;
  public separator = new FormControl(',');

  @ViewChild('fieldInput') fieldInput?: ElementRef<HTMLInputElement>;
  @ViewChild('csvData') csvData?: TextareaComponent;

  // === MONACO EDITOR ===
  public editorOptions = {
    language: 'graphql',
    formatOnPaste: true,
  };

  /** @returns the graphqlQuery form control */
  get queryControl() {
    return this.referenceForm.get('query') as FormControl | null;
  }

  /** @returns name of reference model */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /** @returns type of reference model */
  get type(): string {
    return this.referenceForm.get('type')?.value || '';
  }

  /**
   * Reference data page.
   *
   * @param apollo Apollo service
   * @param route Angular route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param translateService Angular translate service
   * @param breadcrumbService Setups the breadcrumb component variables
   * @param refDataService Reference data service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private translateService: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private refDataService: ReferenceDataService
  ) {
    super();
  }

  /**
   * Build Reference data form group
   *
   * @returns Reference data form group
   */
  private getRefDataForm() {
    const form = new FormGroup({
      name: new FormControl(this.referenceData?.name, Validators.required),
      type: new FormControl(this.referenceData?.type, Validators.required),
      valueField: new FormControl(
        this.referenceData?.valueField,
        Validators.required
      ),
      fields: new FormControl(this.referenceData?.fields, Validators.required),
      apiConfiguration: new FormControl(
        this.referenceData?.apiConfiguration?.id
      ),
      query: new FormControl(this.referenceData?.query),
      path: new FormControl(this.referenceData?.path),
      data: new FormControl(this.referenceData?.data),
    });

    // Clear valueFields when type, apiConfiguration, path or query changes
    const clearFields = () => {
      this.triedToGetFields = false;
      this.valueFields = [];
      form.get('fields')?.setValue([]);
    };

    // Wait for the form to be initialized before subscribing to changes
    setTimeout(() => {
      form
        .get('type')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          clearFields();

          // Clear the query field if the type is not GraphQL
          if (this.type !== referenceDataType.graphql)
            form.get('query')?.setValue('');

          // Set the default query if the type is GraphQL
          if (this.type === referenceDataType.graphql)
            form
              .get('query')
              ?.setValue(
                `# ${this.translateService.instant(
                  'pages.referenceData.tooltip.graphQLFilter'
                )}\n\n${DEFAULT_QUERY}`
              );
        });

      form
        .get('apiConfiguration')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(clearFields);

      form
        .get('path')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(clearFields);

      form
        .get('query')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(clearFields);
    }, 100);

    return form;
  }

  /**
   * Create the Reference data query, and subscribe to the query changes.
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apollo
        .watchQuery<ReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, loading }) => {
            if (data.referenceData) {
              this.referenceData = data.referenceData;
              this.breadcrumbService.setBreadcrumb(
                '@referenceData',
                this.referenceData.name as string
              );
              this.csvValue =
                this.referenceData?.data && this.referenceData?.data.length > 0
                  ? this.convertToCSV(this.referenceData?.data)
                  : '';
              this.newData =
                this.referenceData?.data && this.referenceData?.data.length > 0
                  ? this.referenceData?.data
                  : [];
              this.referenceForm = this.getRefDataForm();
              this.valueFields = this.referenceForm?.get('fields')?.value || [];
              this.loadApiConfigurations(
                this.referenceForm?.get('type')?.value
              );
              // Adapt validators to the type of reference data
              this.referenceForm.get('type')?.valueChanges.subscribe((type) => {
                this.loadApiConfigurations(type);
              });
              this.loading = loading;
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translateService
                      .instant('notification.term.resource')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
              this.router.navigate(['/referencedata']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/referencedata']);
          },
        });
    }
  }

  /**
   * Load all Api Configurations.
   *
   * @param type type of API configuration
   */
  loadApiConfigurations(type?: any): void {
    if (['graphql', 'rest'].includes(type)) {
      this.referenceForm
        .get('apiConfiguration')
        ?.setValidators(Validators.required);
      this.referenceForm.get('query')?.setValidators(Validators.required);
      this.referenceForm.get('fields')?.setValidators(Validators.required);
      if (this.referenceForm.value.apiConfiguration) {
        this.apollo
          .query<ApiConfigurationQueryResponse>({
            query: GET_API_CONFIGURATION,
            variables: {
              id: this.referenceForm.value.apiConfiguration,
            },
          })
          .subscribe(({ data }) => {
            if (data.apiConfiguration) {
              this.selectedApiConfiguration = data.apiConfiguration;
            }
          });
      }

      this.apiConfigurationsQuery =
        this.apollo.watchQuery<ApiConfigurationsQueryResponse>({
          query: GET_API_CONFIGURATIONS_NAMES,
          variables: {
            first: ITEMS_PER_PAGE,
          },
        });
      // this.apiConfigurationsQuery.valueChanges.subscribe(({ loading }) => {
      //   this.loading = loading;
      // });
    } else {
      this.referenceForm.get('apiConfiguration')?.clearValidators();
      this.referenceForm.get('query')?.clearValidators();
      this.referenceForm.get('fields')?.clearValidators();
    }
    this.referenceForm?.get('apiConfiguration')?.updateValueAndValidity();
    this.referenceForm?.get('query')?.updateValueAndValidity();
    this.referenceForm?.get('fields')?.updateValueAndValidity();
  }

  /**
   * Edit the permissions layer.
   *
   * @param e permission event
   */
  saveAccess(e: any): void {
    this.loading = true;
    this.apollo
      .mutate<EditReferenceDataMutationResponse>({
        mutation: EDIT_REFERENCE_DATA,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe({
        next: ({ errors, data, loading }) => {
          this.handleEditReferenceDataResponse(data, errors, loading);
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Handles the reference data mutation response
   *
   * @param {EditReferenceDataMutationResponse} data save mutation data
   * @param {GraphQLError[]} errors save mutation errors
   * @param {boolean} loading save mutation loading state
   * @param {boolean} usingForm if saved data comes from the reference data form
   */
  private handleEditReferenceDataResponse(
    data: EditReferenceDataMutationResponse | null | undefined,
    errors: readonly GraphQLError[] | undefined,
    loading: boolean,
    usingForm: boolean = false
  ) {
    if (errors) {
      this.snackBar.openSnackBar(
        this.translateService.instant('common.notifications.objectNotUpdated', {
          type: this.translateService.instant('common.referenceData.one'),
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      if (data) {
        this.snackBar.openSnackBar(
          this.translateService.instant('common.notifications.objectUpdated', {
            type: this.translateService.instant('common.referenceData.one'),
            value: '',
          })
        );
        this.referenceData = data.editReferenceData;
      }
      if (usingForm) {
        this.referenceForm.markAsPristine();
      }
    }
    this.loading = loading;
  }

  /**
   * Edit the Reference data using referenceForm changes.
   */
  onSave(): void {
    this.loading = true;
    const variables = { id: this.id };
    Object.assign(
      variables,
      this.referenceForm.value.name !== this.referenceData?.name && {
        name: this.referenceForm.value.name,
      },
      this.referenceForm.value.type !== this.referenceData?.type && {
        type: this.referenceForm.value.type,
      },
      this.referenceForm.value.valueField !==
        this.referenceData?.valueField && {
        valueField: this.referenceForm.value.valueField,
      },
      this.referenceForm.value.fields !== this.referenceData?.fields && {
        fields: this.referenceForm.value.fields,
      }
    );
    if (
      ['graphql', 'rest'].includes(get(this.referenceForm, 'value.type', ''))
    ) {
      Object.assign(
        variables,
        this.referenceForm.value.apiConfiguration !==
          this.referenceData?.apiConfiguration?.id && {
          apiConfiguration: this.referenceForm.value.apiConfiguration,
        },
        this.referenceForm.value.path !== this.referenceData?.path && {
          path: this.referenceForm.value.path,
        },
        this.referenceForm.value.query !== this.referenceData?.query && {
          query: this.referenceForm.value.query,
        }
      );
    } else {
      Object.assign(
        variables,
        this.referenceForm.value.data !== this.referenceData?.data && {
          data: this.referenceForm.value.data,
        }
      );
    }
    this.apollo
      .mutate<EditReferenceDataMutationResponse>({
        mutation: EDIT_REFERENCE_DATA,
        variables,
      })
      .subscribe({
        next: ({ errors, data, loading }) => {
          this.handleEditReferenceDataResponse(data, errors, loading, true);
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Add an object to the chip list.
   *
   * @param event input event.
   */
  add(event: string | any): void {
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const input =
          event.type === 'focusout'
            ? this.fieldInput?.nativeElement
            : event.input;
        const value =
          event.type === 'focusout'
            ? this.fieldInput?.nativeElement.value
            : event.value;

        // Add the mail
        if ((value || '').trim()) {
          // Deep copy needed for the edition
          const valueFieldsCopy = [...this.valueFields];
          valueFieldsCopy.push(value.trim());
          this.valueFields = valueFieldsCopy;
        }
        this.setReferenceFormValue();
        // Reset the input value
        if (input) {
          input.value = '';
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Update reference form value programmatically with the current value fields
   */
  private setReferenceFormValue() {
    this.referenceForm?.get('fields')?.setValue(this.valueFields);
    this.referenceForm?.get('fields')?.updateValueAndValidity();
    this.referenceForm?.markAsDirty();
  }

  /**
   * Remove an object from the chip list.
   *
   * @param field field to remove.
   */
  remove(field: string): void {
    const index = this.valueFields.findIndex((x) => x.name === field);
    if (index >= 0) {
      // Deep copy needed for the edition
      const valueFieldsCopy = [...this.valueFields];
      valueFieldsCopy.splice(index, 1);
      this.valueFields = valueFieldsCopy;
    }
    this.setReferenceFormValue();
  }

  /**
   * Validate the CSV input and transform it into JSON object.
   */
  onValidateCSV(): void {
    this.csvLoading = true;
    const dataTemp = this.csvData?.value || '';
    if (dataTemp !== this.csvValue) {
      this.csvValue = dataTemp;
      this.newData = [];
      const lines = dataTemp.split('\n');
      const headers = lines[0]
        .split(this.separator.value || ',')
        .map((x: string) => x.trim());
      if (lines.length < 2) return;
      // Infer types from first line
      const fields = headers.reduce((acc: any, header: any) => {
        const value = lines[1]
          .split(this.separator.value || ',')
          [headers.indexOf(header)].trim();
        const type = inferTypeFromString(value);
        acc.push({ name: header, type });
        return acc;
      }, [] as { name: string; type: string }[]);
      this.valueFields = fields;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i]
          .split(this.separator.value || ',')
          .map((x: string) => x.trim());
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        this.newData.push(obj);
      }
      this.referenceForm?.get('data')?.setValue(this.newData);
      this.referenceForm?.get('data')?.updateValueAndValidity();
      this.referenceForm?.get('fields')?.setValue(this.valueFields);
      this.referenceForm?.get('fields')?.updateValueAndValidity();
      this.referenceForm?.markAsDirty();
    }
    this.csvLoading = false;
  }

  /**
   * Convert the JSON into a csv format.
   *
   * @param obj json to convert
   * @returns csv
   */
  convertToCSV(obj: any): string {
    const array = [Object.keys(obj[0])].concat(obj);
    return array.map((it) => Object.values(it).toString()).join('\n');
  }

  /** Uses the API Configuration to get the fields and parse their types. */
  public async getFields() {
    const apiConfID = this.referenceForm.value.apiConfiguration;
    const path = this.referenceForm.value.path;
    const query = this.referenceForm.value.query;
    const type = this.referenceForm.value.type;
    if (!apiConfID || !query || !type) {
      const missingField = !this.referenceForm.value.apiConfiguration
        ? 'common.apiConfiguration.one'
        : !this.referenceForm.value.query
        ? 'pages.referenceData.queryName'
        : 'pages.referenceData.type';

      this.snackBar.openSnackBar(
        this.translateService.instant(
          'pages.referenceData.fields.missingConfig',
          {
            config: this.translateService.instant(missingField),
          }
        ),
        { error: true }
      );
      return;
    }
    // get the api configuration
    this.loadingFields = true;
    const query$ = this.apollo.query<ApiConfigurationQueryResponse>({
      query: GET_API_CONFIGURATION,
      variables: {
        id: apiConfID,
      },
    });

    const { data: apiConfData } = await firstValueFrom(query$);
    if (!apiConfData?.apiConfiguration) {
      this.loadingFields = false;
      return;
    }
    try {
      this.triedToGetFields = true;
      // get the fields
      const fields = await this.refDataService.getFields(
        apiConfData.apiConfiguration,
        path || '',
        query,
        type
      );
      this.valueFields = fields;
      this.referenceForm?.get('fields')?.setValue(this.valueFields);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        this.snackBar.openSnackBar(e.message, { error: true });
      }
    }
    this.loadingFields = false;
  }

  /**
   * Remove a field from the list.
   *
   * @param field field to remove.
   */
  onRemoveField(field: any) {
    this.valueFields = this.valueFields.filter((x) => x.name !== field.name);
    this.referenceForm?.get('fields')?.setValue(this.valueFields);
  }

  /**
   * On initialization of editor, format code
   *
   * @param editor monaco editor used for scss edition
   */
  public initEditor(editor: any): void {
    const queryControl = this.queryControl;
    if (!queryControl) return;
    if (editor) {
      setTimeout(() => {
        editor
          .getAction('editor.action.formatDocument')
          .run()
          .finally(() => {
            queryControl.markAsPristine();
          });
      }, 100);
    }
  }
}
