import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyModule } from '../../../ui/empty/empty.module';
import {
  ButtonModule,
  FormWrapperModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { createChartWidgetForm } from '../chart-forms';
import { BehaviorSubject } from 'rxjs';
import { createFilterGroup } from '../../../query-builder/query-builder-forms';
import { FilterModule } from '../../../filter/filter.module';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import { Apollo } from 'apollo-angular';
import { GET_RESOURCE_METADATA } from '../graphql/queries';

/** Component for the filters tab of the chart settings */
@Component({
  selector: 'shared-tab-filters',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    EmptyModule,
    ButtonModule,
    DragDropModule,
    TableModule,
    TooltipModule,
    FilterModule,
    FormWrapperModule,
  ],
  templateUrl: './tab-filters.component.html',
  styleUrls: ['./tab-filters.component.scss'],
})
export class TabFiltersComponent implements OnInit {
  /** The chart form */
  @Input() formGroup!: ReturnType<typeof createChartWidgetForm>;
  /** To make drag and drop work with table */
  public data!: BehaviorSubject<AbstractControl[]>;
  /** Enabled drag behavior, needed to set the drag on run time so cdkDragHandle directive works in the table */
  public dragEnabled = false;
  /** Columns displayed in the table */
  public tableCols = ['label', 'filter', 'actions'];
  /** The selected resource */
  public resource: Resource | null = null;
  /** Filters available to set filters from */
  public filterFields: any[] = [];
  /** Tells us which rows are expanded */
  public expandedRows: boolean[] = [];

  /** @returns the form array with the filters */
  get formArray() {
    return this.formGroup.get('filters') as FormArray;
  }

  /**
   *  Component for the filters tab of the chart settings
   *
   * @param fb FormBuilder instance
   * @param apollo Apollo shared service
   */
  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit() {
    this.data = new BehaviorSubject<AbstractControl[]>(this.formArray.controls);
    this.expandedRows = new Array(this.formArray.length).fill(false);

    const resourceID = this.formGroup.get('resource')?.value;

    if (!resourceID) {
      return;
    }

    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: resourceID,
        },
      })
      .subscribe((res) => {
        this.resource = res.data.resource;
        this.filterFields = this.resource?.metadata ?? [];
      });
  }

  /**
   * Refreshes the table view
   */
  updateView(): void {
    this.data.next(this.formArray.controls);
  }

  /** Adds new row to the table */
  addRow(): void {
    const row = this.fb.group({
      filter: createFilterGroup(null),
      label: [null, Validators.required],
    });
    this.formArray.push(row);
    this.expandedRows.push(true);
    this.updateView();
  }

  /**
   * Removes row to the table
   *
   * @param itemIndex item index
   */
  removeRow(itemIndex: number): void {
    this.formArray.removeAt(itemIndex);
    this.updateView();
  }

  /**
   * Handles the dropping of the field in a container
   *
   * @param event The event involved in the drop
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.formArray.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.updateView();
  }
}
