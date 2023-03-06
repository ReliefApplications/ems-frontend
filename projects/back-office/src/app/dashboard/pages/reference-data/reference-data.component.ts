import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ReferenceData,
  SafeSnackBarService,
  referenceDataType,
  ApiConfiguration,
  SafeBreadcrumbService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  EditReferenceDataMutationResponse,
  EDIT_REFERENCE_DATA,
} from './graphql/mutations';
import {
  GetApiConfigurationQueryResponse,
  GetApiConfigurationsQueryResponse,
  GetReferenceDataQueryResponse,
  GET_API_CONFIGURATION,
  GET_API_CONFIGURATIONS_NAMES,
  GET_REFERENCE_DATA,
} from './graphql/queries';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { takeUntil } from 'rxjs/operators';

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
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public id = '';
  public referenceData?: ReferenceData;

  // === FORM ===
  public referenceForm: FormGroup = new FormGroup({});
  public referenceTypeChoices = Object.values(referenceDataType);

  public selectedApiConfiguration?: ApiConfiguration;
  public apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;

  public valueFields: string[] = [];
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  // === CSV ===
  public csvValue = '';
  public newData: any = [];
  public csvLoading = false;

  @ViewChild('fieldInput') fieldInput?: ElementRef<HTMLInputElement>;
  @ViewChild('csvData') csvData?: ElementRef<HTMLInputElement>;

  /** @returns name of reference model */
  get name(): AbstractControl | null {
    return this.referenceForm.get('name');
  }

  /** @returns type of reference model */
  get type(): string {
    return this.referenceForm.get('type')?.value;
  }

  /**
   * Reference data page.
   *
   * @param apollo Apollo service
   * @param route Angular route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param formBuilder Angular form builder
   * @param translateService Angular translate service
   * @param breadcrumbService Setups the breadcrumb component variables
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private breadcrumbService: SafeBreadcrumbService
  ) {
    super();
  }

  /**
   * Create the Reference data query, and subscribe to the query changes.
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apollo
        .watchQuery<GetReferenceDataQueryResponse>({
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
              this.referenceForm = this.formBuilder.group({
                name: [this.referenceData?.name, Validators.required],
                type: [this.referenceData?.type, Validators.required],
                valueField: [
                  this.referenceData?.valueField,
                  Validators.required,
                ],
                fields: [this.referenceData?.fields, Validators.required],
                apiConfiguration: [this.referenceData?.apiConfiguration?.id],
                query: [this.referenceData?.query],
                path: [this.referenceData?.path],
                data: [this.referenceData?.data],
                graphQLFilter: [this.referenceData?.graphQLFilter],
              });
              this.valueFields = this.referenceForm?.get('fields')?.value;
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
          .query<GetApiConfigurationQueryResponse>({
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
        this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
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
      .subscribe(({ data, loading }) => {
        if (data) {
          this.referenceData = data.editReferenceData;
          this.loading = loading;
        }
      });
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
    if (['graphql', 'rest'].includes(this.referenceForm.value.type)) {
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
        },
        this.referenceForm.value.graphQLFilter !==
          this.referenceData?.graphQLFilter && {
          graphQLFilter: this.referenceForm.value.graphQLFilter,
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
      .subscribe(({ errors, data, loading }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectNotUpdated',
              {
                type: this.translateService.instant('common.referenceData.one'),
                error: errors[0].message,
              }
            ),
            { error: true }
          );
          this.loading = false;
        } else {
          this.referenceData = data?.editReferenceData;
          this.referenceForm.markAsPristine();
          this.loading = loading || false;
        }
      });
  }

  /**
   * Add an object to the chip list.
   *
   * @param event input event.
   */
  add(event: MatChipInputEvent | any): void {
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
        this.referenceForm?.get('fields')?.setValue(this.valueFields);
        this.referenceForm?.get('fields')?.updateValueAndValidity();
        this.referenceForm?.markAsDirty();
        // Reset the input value
        if (input) {
          input.value = '';
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Remove an object from the chip list.
   *
   * @param field field to remove.
   */
  remove(field: string): void {
    const index = this.valueFields.indexOf(field);
    if (index >= 0) {
      // Deep copy needed for the edition
      const valueFieldsCopy = [...this.valueFields];
      valueFieldsCopy.splice(index, 1);
      this.valueFields = valueFieldsCopy;
    }
    this.referenceForm?.get('fields')?.setValue(this.valueFields);
    this.referenceForm?.get('fields')?.updateValueAndValidity();
    this.referenceForm?.markAsDirty();
  }

  /**
   * Validate the CSV input and transform it into JSON object.
   */
  onValidateCSV(): void {
    this.csvLoading = true;
    const dataTemp: any = this.csvData?.nativeElement.value;
    if (dataTemp !== this.csvValue) {
      this.csvValue = dataTemp;
      this.newData = [];
      const lines = dataTemp.split('\n');
      const headers = lines[0].split(',').map((x: string) => x.trim());
      this.valueFields = headers;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(',').map((x: string) => x.trim());
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
}
