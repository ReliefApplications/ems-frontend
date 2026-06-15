import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule, SpinnerModule } from '@oort-front/ui';
import { ApplicationDropdownModule } from '../../survey/components/application-dropdown/application-dropdown.module';
import { ResourceDropdownModule } from '../../survey/components/resource-dropdown/resource-dropdown.module';
import { RecordDropdownModule } from '../record-dropdown/record-dropdown.module';
import { CoreGridModule } from '../ui/core-grid/core-grid.module';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';

/**
 * Dialog data interface of the component
 */
interface DialogData {
  gridSettings: any;
  multiselect?: boolean;
  selectedRows?: string[];
  selectable?: boolean;
  displayField?: string;
}

/**
 * Grid of records for resource / resources questions.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    SpinnerModule,
    ResourceDropdownModule,
    ApplicationDropdownModule,
    RecordDropdownModule,
    CoreGridModule,
    TranslateModule,
    ButtonModule,
  ],
  selector: 'shared-search-resource-grid-modal',
  templateUrl: './search-resource-grid-modal.component.html',
  styleUrls: ['./search-resource-grid-modal.component.scss'],
})
export class ResourceGridModalComponent {
  /** Is the grid multiselect */
  public multiSelect = false;
  /** Grid settings */
  public gridSettings: GridSettings;
  /** Selected rows */
  public selectedRows: any[] = [];
  /** Mapped selected items (id -> display field text) */
  public selectedItemsMap: Map<string, string> = new Map();

  /**
   * Is the data selectable
   *
   * @returns is the data selectable
   */
  get selectable(): boolean {
    return this.data.selectable || false;
  }

  /**
   * Grid of records for resource / resources questions.
   *
   * @param data dialog data
   * @param dialogRef Dialog reference of the component
   * @param ref Application reference
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialogRef: DialogRef<ResourceGridModalComponent>,
    private ref: ApplicationRef
  ) {
    if (this.data.multiselect !== undefined) {
      this.multiSelect = this.data.multiselect;
    }
    if (this.data.selectedRows !== undefined) {
      this.selectedRows = [...this.data.selectedRows];
    }

    if (this.data.gridSettings.sort && !this.data.gridSettings.sort.field) {
      delete this.data.gridSettings.sort;
    }
    this.gridSettings = {
      query: this.data.gridSettings,
      actions: {
        delete: false,
        history: false,
        convert: false,
        update: false,
        inlineEdition: false,
        remove: false,
      },
    };
    this.ref.tick();
  }

  /**
   * Handle selection change in the grid.
   *
   * @param selection selection event
   */
  onSelectionChange(selection: any): void {
    const displayField = this.data.displayField || 'id';
    if (this.multiSelect) {
      if (selection.selectedRows.length > 0) {
        selection.selectedRows.forEach((x: any) => {
          const id = x.dataItem.id;
          const text = x.dataItem[displayField] ?? id;
          this.selectedItemsMap.set(id, text);
        });
        this.selectedRows = this.selectedRows.concat(
          selection.selectedRows.map((x: any) => x.dataItem.id)
        );
      }
      if (selection.deselectedRows.length > 0) {
        const deselectedRows = selection.deselectedRows.map(
          (r: any) => r.dataItem.id
        );
        deselectedRows.forEach((id: string) => {
          this.selectedItemsMap.delete(id);
        });
        this.selectedRows = this.selectedRows.filter(
          (r: any) => !deselectedRows.includes(r)
        );
      }
    } else {
      this.selectedItemsMap.clear();
      if (selection.selectedRows.length > 0) {
        const x = selection.selectedRows[0];
        const id = x.dataItem.id;
        const text = x.dataItem[displayField] ?? id;
        this.selectedItemsMap.set(id, text);
      }
      this.selectedRows = selection.selectedRows.map((x: any) => x.dataItem.id);
    }
  }

  /**
   * Close the modal, indicating if update is required
   *
   * @param saveChanges is update required
   */
  closeModal(saveChanges = true): void {
    this.ref.tick();
    if (saveChanges) {
      const result = this.selectedRows.map((id) => ({
        id,
        text: this.selectedItemsMap.get(id) || id,
      }));
      this.dialogRef.close(result as any);
    }
  }
}
