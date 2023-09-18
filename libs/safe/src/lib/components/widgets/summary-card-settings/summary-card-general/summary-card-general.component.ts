import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SummaryCardItemModule } from '../../summary-card/summary-card-item/summary-card-item.module';
import { SummaryCardFormT } from '../summary-card-settings.component';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { Aggregation } from '../../../../models/aggregation.model';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { get } from 'lodash';
import { SafeGridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { SafeAggregationService } from '../../../../services/aggregation/aggregation.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  ButtonModule,
  CheckboxModule,
  DividerModule,
  FormWrapperModule,
  GraphQLSelectComponent,
  GraphQLSelectModule,
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';

/** Default number of resources to be fetched per page */
const ITEMS_PER_PAGE = 10;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Component for the general summary cards tab */
@Component({
  selector: 'safe-summary-card-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LayoutModule,
    ButtonModule,
    IconModule,
    SummaryCardItemModule,
    GraphQLSelectModule,
    DividerModule,
    FormWrapperModule,
    SelectMenuModule,
    SelectOptionModule,
    RadioModule,
    CheckboxModule,
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() tileForm!: SummaryCardFormT;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Input() selectedAggregation: Aggregation | null = null;

  @Output() resourceChange = new EventEmitter<Resource | null>();
  @Output() layoutChange = new EventEmitter<Layout | null>();
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

  /** Number of columns */
  colsNumber = MAX_COL_SPAN;

  /** Resource query used in graphql-select */
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /** Reference to resource graphql-select */
  @ViewChild(GraphQLSelectComponent)
  private resourceSelect?: GraphQLSelectComponent;

  /**
   * Changes display when windows size changes.
   *
   * @param event window resize event
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
  }

  /**
   * Component for the general summary cards tab
   *
   * @param dialog Shared dialog service
   * @param apollo Apollo service
   * @param layoutService Shared layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private apollo: Apollo,
    private layoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    // Resource change
    this.tileForm
      .get('card.resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resource) => {
        if (!resource) {
          this.resourceChange.emit(null);
        } else {
          this.resourceChange.emit(
            this.resourceSelect?.elements
              .getValue()
              .find((r) => r.id === resource) || null
          );
        }
      });
  }

  /**
   * Changes the number of displayed columns.
   *
   * @param width width of the screen.
   * @returns new number of cols.
   */
  private setColsNumber(width: number): number {
    if (width <= 480) {
      return 1;
    }
    if (width <= 600) {
      return 2;
    }
    if (width <= 800) {
      return 4;
    }
    if (width <= 1024) {
      return 6;
    }
    return MAX_COL_SPAN;
  }

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    if (!this.selectedResource) return;
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.selectedResource,
        hasLayouts: get(this.selectedResource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.tileForm.get('card.layout')?.setValue(value);
        } else {
          this.tileForm.get('card.layout')?.setValue((value as any).id);
          this.layoutChange.emit(value);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { SafeEditLayoutModalComponent } = await import(
      '../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.selectedLayout,
        queryName: this.selectedResource?.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedLayout) {
        this.layoutService
          .editLayout(this.selectedLayout, value, this.selectedResource?.id)
          .subscribe((res: any) => {
            this.layoutChange.emit(res.data?.editLayout || null);
          });
      }
    });
  }

  /**
   * Adds a new aggregation for the resource.
   */
  async addAggregation(): Promise<void> {
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.selectedResource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.tileForm.get('card.aggregation')?.setValue(value);
        } else {
          this.tileForm.get('card.aggregation')?.setValue((value as any).id);
          this.aggregationChange.emit(value);
        }
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { SafeEditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.selectedResource,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedAggregation) {
        this.aggregationService
          .editAggregation(
            this.selectedAggregation,
            value,
            this.selectedResource?.id
          )
          .subscribe((res) => {
            this.aggregationChange.emit(res.data?.editAggregation || null);
          });
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
}
