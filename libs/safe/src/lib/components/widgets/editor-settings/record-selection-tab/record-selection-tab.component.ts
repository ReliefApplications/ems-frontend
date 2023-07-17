import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorFormType } from '../editor-settings.component';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { get } from 'lodash';
import { SafeGridLayoutService } from '../../../../../../../../libs/safe/src/lib/services/grid-layout/grid-layout.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

/** Default number of resources to be fetched per page */
const ITEMS_PER_PAGE = 10;

/** Component for the record selection in the editor widget settings */
@Component({
  selector: 'safe-record-selection-tab',
  templateUrl: './record-selection-tab.component.html',
  styleUrls: ['./record-selection-tab.component.scss'],
})
export class RecordSelectionTabComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: EditorFormType;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Output() resourceChange = new EventEmitter<Resource | null>();
  @Output() layoutChange = new EventEmitter<Layout | null>();

  public selectedRecordID: string | null = null;

  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /**
   * Component for the record selection in the editor widget settings
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param gridLayoutService Shared layout service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: SafeGridLayoutService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedRecordID = this.form.get('record')?.value || null;
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    // Resource change
    this.form
      .get('resource')
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

        // clear layout and record
        this.form.get('layout')?.setValue(null);
        this.layoutChange.emit(null);

        this.form.get('record')?.setValue(null);
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

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    if (!this.selectedResource) return;
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
          this.form.get('layout')?.setValue(value);
        } else {
          this.layoutChange.emit(value);
          this.form.get('layout')?.setValue((value as any).id);
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
        this.gridLayoutService
          .editLayout(this.selectedLayout, value, this.selectedResource?.id)
          .subscribe((res: any) => {
            this.layoutChange.emit(res.data?.editLayout || null);
          });
      }
    });
  }

  /** Handles deselect current layout */
  public deselectLayout(): void {
    this.layoutChange.emit(null);
    this.form.get('layout')?.setValue(null);
    this.form.get('record')?.setValue(null);
  }

  /**
   * Updates the selected record when the selected row is changed.
   *
   * @param event selection event
   */
  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      this.form.get('record')?.setValue(event.selectedRows[0].dataItem.id);
      this.selectedRecordID = event.selectedRows[0].dataItem.id;
    } else {
      this.form.get('record')?.setValue(null);
      this.selectedRecordID = null;
    }
  }
}
