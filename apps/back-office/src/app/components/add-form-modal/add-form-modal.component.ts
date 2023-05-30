import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GetResourceByIdQueryResponse,
  GET_RESOURCE_BY_ID,
} from './graphql/queries';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '@oort-front/safe';
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

/** Default items per query, for pagination */
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
    MatFormFieldModule,
    FormWrapperModule,
    MatButtonModule,
    ToggleModule,
    TranslateModule,
    SafeIconModule,
    GraphQLSelectModule,
    DialogModule,
    TooltipModule,
    RadioModule,
    IconModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ChipModule,
  ],
  selector: 'app-add-form-modal',
  templateUrl: './add-form-modal.component.html',
  styleUrls: ['./add-form-modal.component.scss'],
})
export class AddFormModalComponent implements OnInit {
  // === REACTIVE FORM ===
  public form!: UntypedFormGroup;

  // === DATA ===
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  public templates: any[] = [];

  @ViewChild('resourceSelect') resourceSelect?: MatSelect;

  /**
   * Add form modal
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   * @param apollo Apollo service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<AddFormModalComponent>,
    private apollo: Apollo
  ) {}

  /** Load the resources and build the form. */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      newResource: [true],
      resource: [null],
      inheritsTemplate: [false],
      template: [null],
    });
    this.form.get('newResource')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.form.get('resource')?.clearValidators();
        this.form.patchValue({
          resource: null,
          inheritsTemplate: false,
          template: null,
        });
      } else {
        this.form.get('resource')?.setValidators([Validators.required]);
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

    this.form.get('resource')?.valueChanges.subscribe((value: string) => {
      if (value) {
        this.getResource(value);
      } else {
        this.templates = [];
      }
      this.form.patchValue({
        template: null,
      });
    });

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onResourceSearchChange(search: string): void {
    const variables = this.resourcesQuery.variables;
    this.resourcesQuery.refetch({
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
   * Called on resource input change.
   * Load the templates linked to that resource.
   *
   * @param id resource id
   */
  getResource(id: string): void {
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        this.templates = data.resource.forms || [];
      });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
