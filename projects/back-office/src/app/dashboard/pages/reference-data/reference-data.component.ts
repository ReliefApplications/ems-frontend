import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  EditReferenceDataMutationResponse,
  EDIT_REFERENCE_DATA,
} from './graphql/mutations';
import {
  GetApiConfigurationsQueryResponse,
  GetReferenceDataQueryResponse,
  GET_API_CONFIGURATIONS_NAMES,
  GET_REFERENCE_DATA,
} from './graphql/queries';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { MatSelect } from '@angular/material/select';
import { MatChipInputEvent } from '@angular/material/chips';

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
export class ReferenceDataComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public id = '';
  public referenceData?: ReferenceData;
  private apolloSubscription?: Subscription;

  // === FORM ===
  public referenceForm: FormGroup = new FormGroup({});
  public referenceTypeChoices = Object.values(referenceDataType);

  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  private apiConfigurations = new BehaviorSubject<ApiConfiguration[]>([]);
  public apiConfigurations$!: Observable<ApiConfiguration[]>;

  public valueFields: string[] = [];
  readonly separatorKeysCodes: number[] = SEPARATOR_KEYS_CODE;

  // === CSV ===
  public csvValue = '';
  public newData: any = [];
  public csvLoading = false;

  @ViewChild('formSelect') apiConfSelect?: MatSelect;
  @ViewChild('fieldInput') fieldInput?: ElementRef<HTMLInputElement>;
  @ViewChild('csvData') csvData?: ElementRef<HTMLInputElement>;

  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };

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
  ) {}

  /**
   * Create the Reference data query, and subscribe to the query changes.
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apolloSubscription = this.apollo
        .watchQuery<GetReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe(
          (res) => {
            if (res.data.referenceData) {
              this.referenceData = res.data.referenceData;
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
                name: [
                  this.referenceData?.name,
                  [Validators.required, Validators.pattern('^[A-Za-z-_]+$')],
                ],
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
              this.loading = res.data.loading;
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
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/referencedata']);
          }
        );
    }
  }

  /**
   * Unsubscribe from the apollo subscription if needed.
   */
  ngOnDestroy(): void {
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
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

      this.apiConfigurationsQuery =
        this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
          query: GET_API_CONFIGURATIONS_NAMES,
          variables: {
            first: ITEMS_PER_PAGE,
          },
        });

      this.apiConfigurations$ = this.apiConfigurations.asObservable();
      this.apiConfigurationsQuery.valueChanges.subscribe((res) => {
        this.apiConfigurations.next(
          res.data.apiConfigurations.edges.map((x) => x.node)
        );
        this.pageInfo = res.data.apiConfigurations.pageInfo;
        this.loading = res.loading;
      });
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
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
    this.loading = true;
    this.apollo
      .mutate<EditReferenceDataMutationResponse>({
        mutation: EDIT_REFERENCE_DATA,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.referenceData = res.data.editReferenceData;
          this.loading = res.data.loading;
        }
      });
  }

  /**
   * Edit the Reference data using referenceForm changes.
   */
  onSave(): void {
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
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
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectNotUpdated',
              {
                type: this.translateService.instant('common.referenceData.one'),
                error: res.errors[0].message,
              }
            ),
            { error: true }
          );
          this.loading = false;
        } else {
          this.referenceData = res.data?.editReferenceData;
          this.referenceForm.markAsPristine();
          this.loading = res.data?.loading || false;
        }
      });
  }

  /**
   * Add scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.apiConfSelect) {
      const panel = this.apiConfSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more forms on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.apiConfigurationsQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              apiConfigurations: {
                edges: [
                  ...prev.apiConfigurations.edges,
                  ...fetchMoreResult.apiConfigurations.edges,
                ],
                pageInfo: fetchMoreResult.apiConfigurations.pageInfo,
                totalCount: fetchMoreResult.apiConfigurations.totalCount,
              },
            });
          },
        });
      }
    }
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
