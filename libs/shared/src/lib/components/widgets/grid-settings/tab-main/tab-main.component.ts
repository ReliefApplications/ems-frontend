import { Component, Input, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Form } from '../../../../models/form.model';
import {
  ReferenceData,
  ReferenceDatasQueryResponse,
} from '../../../../models/reference-data.model';
import { GET_RESOURCES, GET_REFERENCE_DATAS } from '../graphql/queries';
import { takeUntil } from 'rxjs';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent extends UnsubscribeComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Input() form: Form | null = null;
  @Input() resource: Resource | null = null;
  @Input() referenceData: ReferenceData | null = null;
  @Input() queries: any[] = [];
  @Input() templates: Form[] = [];

  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  public referenceDatasQuery!: QueryRef<ReferenceDatasQueryResponse>;
  public origin!: FormControl<string | null>;

  /**
   * Main tab of widget grid configuration modal
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    // Set origin form control
    if (this.formGroup.value.resource) {
      this.origin = new FormControl('resource');
    } else {
      if (this.formGroup.value.referenceData) {
        this.origin = new FormControl('referenceData');
      } else {
        this.origin = new FormControl();
      }
    }
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
    this.referenceDatasQuery =
      this.apollo.watchQuery<ReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
          sortField: 'name',
        },
      });
    // Listen to origin changes
    this.origin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resource = null;
      this.referenceData = null;
      this.formGroup.patchValue({ resource: null, referenceData: null });
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onResourceSearchChange(search: string): void {
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

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onReferenceDataSearchChange(search: string): void {
    this.referenceDatasQuery.refetch({
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
}
