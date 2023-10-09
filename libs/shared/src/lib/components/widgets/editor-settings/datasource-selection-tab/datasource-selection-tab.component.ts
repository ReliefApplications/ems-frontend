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
import { LayoutModule } from '@progress/kendo-angular-layout';
import { Aggregation } from '../../../../models/aggregation.model';
import { Resource } from '../../../../models/resource.model';
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
  IconModule,
  RadioModule,
  SelectMenuModule,
  SelectOptionModule,
  TooltipModule,
} from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { GET_REFERENCE_DATAS, GET_RESOURCES } from '../graphql/queries';
import { ReferenceData } from '../../../../models/reference-data.model';
import { AggregationOriginSelectComponent } from '../../../aggregation/aggregation-origin-select/aggregation-origin-select.component';
import { CoreGridModule } from '../../../ui/core-grid/core-grid.module';

/** Define max width of summary card */
const MAX_COL_SPAN = 8;

/** Component for the general summary cards tab */
@Component({
  selector: 'shared-datasource-selection-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LayoutModule,
    ButtonModule,
    CoreGridModule,
    IconModule,
    DividerModule,
    FormWrapperModule,
    SelectMenuModule,
    SelectOptionModule,
    RadioModule,
    CheckboxModule,
    TooltipModule,
    AggregationOriginSelectComponent,
  ],
  templateUrl: './datasource-selection-tab.component.html',
  styleUrls: ['./datasource-selection-tab.component.scss'],
})
export class DatasourceSelectionTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() tileForm!: any;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedReferenceData: ReferenceData | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Input() selectedAggregation: Aggregation | null = null;

  @Output() layoutChange = new EventEmitter<Layout | null>();
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // === DATA ===
  getResources = GET_RESOURCES;
  getReferenceDatas = GET_REFERENCE_DATAS;

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
   * @param layoutService Shared layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private dialog: Dialog,
    private layoutService: GridLayoutService,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);
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
          this.tileForm.get('layout')?.setValue(value);
        } else {
          this.tileForm.get('layout')?.setValue((value as any).id);
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
          get(
            this.selectedResource ?? this.selectedReferenceData,
            'aggregations.totalCount',
            0
          ) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
        referenceData: this.selectedReferenceData,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.tileForm.get('aggregation')?.setValue(value);
        } else {
          this.tileForm.get('aggregation')?.setValue((value as any).id);
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
        referenceData: this.selectedReferenceData,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedAggregation) {
        const id = this.selectedResource?.id ?? this.selectedReferenceData?.id;
        const type = this.selectedResource?.id ? 'resource' : 'referenceData';
        this.aggregationService
          .editAggregation(this.selectedAggregation, value, id, type)
          .subscribe((res) => {
            this.aggregationChange.emit(res.data?.editAggregation || null);
          });
      }
    });
  }

  /**
   * Updates the selected record when the selected row is changed.
   *
   * @param event selection event
   */
  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      if (this.selectedLayout) {
        this.tileForm
          .get('record')
          ?.setValue(event.selectedRows[0].dataItem.id);
      } else if (this.selectedAggregation) {
        this.tileForm
          .get('aggregationItem')
          ?.setValue(
            event.selectedRows[0].dataItem[
              this.tileForm.get('aggregationItemIdentifier').value
            ]
          );
      }
    } else {
      if (this.selectedLayout) {
        this.tileForm.get('record')?.setValue(null);
      } else if (this.selectedAggregation) {
        this.tileForm.get('aggregationItem')?.setValue(null);
      }
    }
  }
}
