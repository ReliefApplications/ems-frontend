import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  FormWrapperModule,
  GraphQLSelectModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { AggregationSource } from '../../../services/aggregation/aggregation.service';
import { Apollo, QueryRef, TypedDocumentNode } from 'apollo-angular';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../models/resource.model';
import {
  ReferenceData,
  ReferenceDatasQueryResponse,
} from '../../../models/reference-data.model';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyObject } from 'apollo-angular/types';
import { DocumentNode } from '@apollo/client';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Shared aggregation grid component.
 */
@Component({
  selector: 'shared-aggregation-origin-select',
  standalone: true,
  imports: [
    CommonModule,
    FormWrapperModule,
    ButtonModule,
    SelectMenuModule,
    GraphQLSelectModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './aggregation-origin-select.component.html',
  styleUrls: ['./aggregation-origin-select.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class AggregationOriginSelectComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() selectedResource?: Resource | null;
  @Input() resourcesQueryValue!:
    | DocumentNode
    | TypedDocumentNode<ResourcesQueryResponse, EmptyObject>;
  @Input() selectedReferenceData?: ReferenceData | null;
  @Input() referenceDatasQueryValue!:
    | DocumentNode
    | TypedDocumentNode<ReferenceDatasQueryResponse, EmptyObject>;

  @Output() sourceChange: EventEmitter<{
    type: AggregationSource;
    value: Resource | ReferenceData | null | undefined;
  }> = new EventEmitter<{
    type: AggregationSource;
    value: Resource | ReferenceData | null | undefined;
  }>();

  public origin!: FormControl<string | null>;
  private parentFormContainer = inject(ControlContainer);
  public referenceDatasQuery!: QueryRef<ReferenceDatasQueryResponse>;
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;

  /**
   * Get components parent form control
   *
   * @returns {FormGroup} parent component control
   */
  get parentForm() {
    return this.parentFormContainer?.control as FormGroup;
  }

  /**
   * Shared aggregation origin select interface constructor
   *
   * @param apollo Angular apollo client service
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    // Set origin form control
    if (this.resourcesQueryValue && !this.referenceDatasQueryValue) {
      this.origin = new FormControl('resource');
    } else if (!this.resourcesQueryValue && this.referenceDatasQueryValue) {
      this.origin = new FormControl('referenceData');
    } else {
      if (this.parentForm.get('resource')?.value) {
        this.origin = new FormControl('resource');
      } else {
        if (this.parentForm.get('referenceData')?.value) {
          this.origin = new FormControl('referenceData');
        } else {
          this.origin = new FormControl();
        }
      }
    }

    if (this.resourcesQueryValue) {
      this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
        query: this.resourcesQueryValue,
        variables: {
          first: ITEMS_PER_PAGE,
          sortField: 'name',
        },
      });
    }
    if (this.referenceDatasQueryValue) {
      this.referenceDatasQuery =
        this.apollo.watchQuery<ReferenceDatasQueryResponse>({
          query: this.referenceDatasQueryValue,
          variables: {
            first: ITEMS_PER_PAGE,
            sortField: 'name',
          },
        });
    }

    // Listen to origin changes
    this.origin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.parentForm.patchValue({ resource: null, referenceData: null });
    });

    // If there is a reference data selected we make sure that the aggregation field is required
    if (this.parentForm.get('referenceData')?.value) {
      this.parentForm.get('aggregation')?.setValidators(Validators.required);
      this.parentForm.updateValueAndValidity();
    }

    this.setAggregationValidatorsListener();
  }

  /**
   * Initializes listener to handle validation of current control for aggregation value whenever there is a reference data selected
   */
  private setAggregationValidatorsListener() {
    this.parentForm
      .get('referenceData')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        let validatorUpdate = false;
        // If we have a reference data selected and we don't have any validators set for the aggregation field, add it
        if (
          data &&
          !this.parentForm.get('aggregation')?.hasValidator(Validators.required)
        ) {
          this.parentForm
            .get('aggregation')
            ?.setValidators(Validators.required);
          validatorUpdate = true;
        }
        // If we have not a reference data selected and we have any validators set for the aggregation field, remove it
        else if (
          !data &&
          this.parentForm.get('aggregation')?.hasValidator(Validators.required)
        ) {
          this.parentForm
            .get('aggregation')
            ?.removeValidators(Validators.required);
          validatorUpdate = true;
        }
        // If there is any validator change done, trigger the validity of the affected field
        if (validatorUpdate) {
          this.parentForm
            .get('aggregation')
            ?.updateValueAndValidity({ emitEvent: false });
        }
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
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onReferenceDataSearchChange(search: string): void {
    const variables = this.referenceDatasQuery.variables;
    this.referenceDatasQuery.refetch({
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
   * Handle search query for the given source type
   *
   * @param {AggregationSource} type aggregation's source type
   * @param search search value for the query
   */
  handleSearchChangeBySource(type: AggregationSource, search: string) {
    switch (type) {
      case 'resource':
        this.onResourceSearchChange(search);
        break;
      case 'referenceData':
        this.onReferenceDataSearchChange(search);
        break;
      default:
        break;
    }
  }

  /**
   * Send to the parent component current selected source
   *
   * @param {AggregationSource} type source type of the aggregation
   * @param id of the selected source, could be null
   */
  setCurrentItemByType(type: AggregationSource, id: string | string[] | null) {
    if (type === 'resource') {
      this.selectedResource =
        this.resourcesQuery
          .getCurrentResult()
          .data?.resources.edges.find((r) => r.node.id === id)?.node || null;
    } else if (type === 'referenceData') {
      this.selectedReferenceData =
        this.referenceDatasQuery
          .getCurrentResult()
          .data?.referenceDatas.edges.find((r) => r.node.id === id)?.node ||
        null;
    }
    this.sourceChange.emit({
      type,
      value:
        type === 'resource'
          ? this.selectedResource
          : this.selectedReferenceData,
    });
  }

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: AggregationSource, event: Event) {
    if (this.parentForm.get(`${formField}`)?.value) {
      this.parentForm.get(`${formField}`)?.setValue(null);
    }
    event.stopPropagation();
  }
}
