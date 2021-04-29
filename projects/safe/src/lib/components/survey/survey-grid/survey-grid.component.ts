import { Component, OnInit } from '@angular/core';
import { GridDataResult, SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY, MatSelect } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_RESOURCE_BY_ID, GetResourceByIdQueryResponse } from '../../../graphql/queries';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeRecordModalComponent } from '../../record-modal/record-modal.component';
import { resourcesFilterValues } from '../../../survey/components/resources';
import { PopupService } from '@progress/kendo-angular-popup';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

const SELECTABLE_SETTINGS: SelectableSettings = {
  checkboxOnly: true,
  mode: 'multiple',
  drag: false
};

@Component({
  selector: 'safe-survey-grid',
  templateUrl: './survey-grid.component.html',
  styleUrls: ['./survey-grid.component.scss'],
  providers: [
    PopupService,
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class SafeSurveyGridComponent implements OnInit{

  // === INPUTS ===
  public id = '';
  public field = '';
  public selectedIds: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);

  // === DATA ===
  public gridData: GridDataResult = { data: [], total: 0};
  public availableRecords: any[] = [];
  public canDeleteSelectedRows = false;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
  public selectableSettings = SELECTABLE_SETTINGS;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    resourcesFilterValues.subscribe((data) => {
      this.fetchData();
    });
  }

  fetchData(): void {
    if (this.id && this.field) {
      this.apollo.watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
          filters: resourcesFilterValues.getValue()[0].operator ? resourcesFilterValues.getValue() : null
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.resource) {
          const records = res.data.resource.records || [];
          this.availableRecords = [];
          const selectedIds = this.selectedIds.getValue();
          // const value = this.availableRecords.filter(d => d.value === event.value)[0];
          const selectedRecords = records.filter(x => selectedIds.includes(x.id)).map(x => {
            return {
              value: x.id,
              text: x.data[this.field]
            };
          });
          this.gridData = {
            data: selectedRecords,
            total: selectedRecords.length
          };
          this.availableRecords = records.filter(x => !selectedIds.includes(x.id)).map(x => {
            return {
              value: x.id,
              text: x.data[this.field]
            };
          });
        } else {
          this.snackBar.openSnackBar('No access provided to this resource.', {error: true});
        }
      }, (err) => {
        this.snackBar.openSnackBar(err.message, {error: true});
      });
    }
  }

  selectionChange(selection: SelectionEvent): void {
    const deselectedRows = selection.deselectedRows || [];
    const selectedRows = selection.selectedRows || [];
    if (deselectedRows.length > 0) {
      const deselectIndex = deselectedRows.map((item => item.index));
      this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
    }
    if (selectedRows.length > 0) {
      const selectedItems = selectedRows.map((item) => item.index);
      this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
    }
  }

  onAdd(event: any): void {
    const matSelect: MatSelect = event.source;
    matSelect.writeValue(null);
    const value = this.availableRecords.filter(d => d.value === event.value)[0];
    if (value) {
      const selectedRecords: any[] = this.gridData.data;
      selectedRecords.push(value);
      this.selectedIds.next(selectedRecords.map(x => x.value));
      this.gridData = {
        data: selectedRecords,
        total: selectedRecords.length
      };
      this.availableRecords = this.availableRecords.filter(d => d.value !== value.value);
    }
  }

  public onDeleteRow(items: number[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Delete row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the deletion of ${rowsSelected > 1 ?
          'these ' + rowsSelected : 'this'} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        if (resourcesFilterValues.getValue()[0].value.trim().length > 0) {
          this.fetchData();
        } else {
          items.forEach(i => this.availableRecords.push(this.gridData.data[i]));
        }
        const selectedRecords: any[] = this.gridData.data.filter((_, index) => !items.includes(index));
        this.selectedIds.next(selectedRecords.map(x => x.value));
        this.gridData = {
          data: selectedRecords,
          total: selectedRecords.length
        };
        this.selectedRowsIndex = [];
      }
    });
  }

  public onShowDetails(index: number): void {
    this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.gridData.data[index].value,
      }
    });
  }
}
