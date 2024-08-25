import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GET_RESOURCE_BY_ID } from './graphql/queries';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ToggleModule,
  TooltipModule,
  RadioModule,
  IconModule,
  ButtonModule,
  SelectMenuModule,
  ChipModule,
  FormWrapperModule,
  GraphQLSelectModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { DialogRef } from '@angular/cdk/dialog';
import {
  Form,
  ResourceQueryResponse,
  ResourceSelectComponent,
} from '@oort-front/shared';
import {
  ApiConfiguration,
  ApiConfigurationsQueryResponse,
  ApiConfigurationQueryResponse,
} from '@oort-front/shared';
import {
  GET_API_CONFIGURATION,
  GET_API_CONFIGURATIONS_NAMES,
} from './graphql/queries';

/** Default pagination parameter. */
const ITEMS_PER_PAGE = 10;

/**
 * Add form component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ToggleModule,
    TranslateModule,
    DialogModule,
    TooltipModule,
    RadioModule,
    IconModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ChipModule,
    ResourceSelectComponent,
    GraphQLSelectModule,
  ],
  selector: 'app-add-form-modal',
  templateUrl: './add-form-modal.component.html',
  styleUrls: ['./add-form-modal.component.scss'],
})
export class AddFormModalComponent implements OnInit {
  /** Form group */
  public form = this.fb.group({
    name: ['', Validators.required],
    type: this.fb.nonNullable.control('core'),
    resource: [null],
    inheritsTemplate: this.fb.nonNullable.control(false),
    template: null,
    apiConfiguration: [null],
    kobo: [''],
  });
  /** Available templates */
  public templates: Form[] = [];
  /** Selected API configuration */
  public selectedApiConfiguration?: ApiConfiguration;
  /** Api configurations query */
  public apiConfigurationsQuery!: QueryRef<ApiConfigurationsQueryResponse>;

  /**
   * Selected template
   *
   * @returns {Form} selected template
   */
  get selectedTemplate() {
    return this.templates.find(
      (x) => x.id === this.form.get('template')?.value
    );
  }

  /**
   * Add form modal
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Apollo service
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddFormModalComponent>,
    private apollo: Apollo
  ) {}

  /** Load the resources and build the form. */
  ngOnInit(): void {
    this.form.get('type')?.valueChanges.subscribe((value: string) => {
      if (value == 'core') {
        this.form.get('resource')?.clearValidators();
        this.form.get('kobo')?.clearValidators();
        this.form.get('apiConfiguration')?.clearValidators();
        this.form.patchValue({
          resource: null,
          inheritsTemplate: false,
          template: null,
          apiConfiguration: null,
          kobo: null,
        });
      } else if (value == 'template') {
        this.form.get('kobo')?.clearValidators();
        this.form.get('apiConfiguration')?.clearValidators();
        this.form.patchValue({
          apiConfiguration: null,
          kobo: null,
        });
        this.form.get('resource')?.setValidators([Validators.required]);
      } else {
        this.form.get('resource')?.clearValidators();
        this.form.patchValue({
          resource: null,
          inheritsTemplate: false,
          template: null,
        });
        this.loadApiConfigurations();
        this.form.get('kobo')?.setValidators([Validators.required]);
      }
      this.form.get('resource')?.updateValueAndValidity();
    });

    this.form
      .get('inheritsTemplate')
      ?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.form.get('template')?.setValidators([Validators.required]);
        } else {
          this.form.get('template')?.clearValidators();
          this.form.patchValue({
            template: null,
          });
        }
        this.form.get('template')?.updateValueAndValidity();
      });

    this.form
      .get('resource')
      ?.valueChanges.subscribe((value: string | null) => {
        if (value) {
          this.getResource(value);
        } else {
          this.templates = [];
        }
        this.form.patchValue({
          template: null,
        });
      });
  }

  /**
   * Called on resource input change.
   * Load the templates linked to that resource.
   *
   * @param id resource id
   */
  getResource(id: string): void {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        this.templates = data.resource.forms || [];
      });
  }

  /**
   * Load all Api Configurations.
   *
   */
  loadApiConfigurations(): void {
    this.form.get('apiConfiguration')?.setValidators(Validators.required);
    if (this.form.value.apiConfiguration) {
      this.apollo
        .query<ApiConfigurationQueryResponse>({
          query: GET_API_CONFIGURATION,
          variables: {
            id: this.form.value.apiConfiguration,
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
    this.form?.get('apiConfiguration')?.updateValueAndValidity();
  }

  /**
   * Update query based on text search.
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.apiConfigurationsQuery.variables;
    this.apiConfigurationsQuery.refetch({
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
}
