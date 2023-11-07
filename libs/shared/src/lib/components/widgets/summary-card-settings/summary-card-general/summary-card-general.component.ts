import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SummaryCardItemModule } from '../../summary-card/summary-card-item/summary-card-item.module';
import { SummaryCardFormT } from '../summary-card-settings.component';
import { Apollo, QueryRef } from 'apollo-angular';
import { Aggregation } from '../../../../models/aggregation.model';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { get } from 'lodash';
import { GridLayoutService } from '../../../../services/grid-layout/grid-layout.service';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import {
  ButtonModule,
  CheckboxModule,
  DividerModule,
  FormWrapperModule,
  GraphQLSelectModule,
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
  TooltipModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { GET_RESOURCES } from '../graphql/queries';
import { Form } from '../../../../models/form.model';

/** Default number of resources to be fetched per page */
const ITEMS_PER_PAGE = 10;
/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Component for the general summary cards tab */
@Component({
  selector: 'shared-summary-card-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
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
    TooltipModule,
  ],
  templateUrl: './summary-card-general.component.html',
  styleUrls: ['./summary-card-general.component.scss'],
})
export class SummaryCardGeneralComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: SummaryCardFormT;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Input() selectedAggregation: Aggregation | null = null;
  @Input() templates: Form[] = [];

  @Output() resourceChange = new EventEmitter<Resource | null>();
  @Output() layoutChange = new EventEmitter<Layout | null>();
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // === DATA ===
  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;

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
    private layoutService: GridLayoutService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);

    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    // Resource change
    this.formGroup
      .get('card.resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resource) => {
        if (!resource) this.resourceChange.emit(null);
        else
          this.resourceChange.emit(
            this.resourcesQuery
              .getCurrentResult()
              .data.resources.edges.find((r) => r.node.id === resource)?.node ||
              null
          );
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
    if (!this.selectedResource) {
      return;
    }
    const { AddLayoutModalComponent } = await import(
      '../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.selectedResource,
        hasLayouts: get(this.selectedResource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('card.layout')?.setValue(value);
        } else {
          this.formGroup.get('card.layout')?.setValue((value as any).id);
          this.layoutChange.emit(value);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import(
      '../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
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
          this.formGroup.get('card.aggregation')?.setValue(value);
        } else {
          this.formGroup.get('card.aggregation')?.setValue((value as any).id);
          this.aggregationChange.emit(value);
        }
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
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
