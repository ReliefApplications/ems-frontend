import { ApplicationRef, Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { GridSettings } from '../ui/core-grid/models/grid-settings.model';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '@oort-front/ui';
import { ResourceDropdownModule } from '../../survey/components/resource-dropdown/resource-dropdown.module';
import { ApplicationDropdownModule } from '../../survey/components/application-dropdown/application-dropdown.module';
import { RecordDropdownModule } from '../record-dropdown/record-dropdown.module';
import { CoreGridModule } from '../ui/core-grid/core-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

/**
 * Dialog data interface of the component
 */
interface DialogData {
  gridSettings: any;
  multiselect?: boolean;
  selectedRows?: string[];
  selectable?: boolean;
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
  public multiSelect = false;
  public gridSettings: GridSettings;
  public selectedRows: any[] = [];

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
    if (this.data.multiselect !== undefined)
      this.multiSelect = this.data.multiselect;
    if (this.data.selectedRows !== undefined)
      this.selectedRows = [...this.data.selectedRows];

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
    if (this.multiSelect) {
      if (selection.selectedRows.length > 0) {
        this.selectedRows = this.selectedRows.concat(
          selection.selectedRows.map((x: any) => x.dataItem.id)
        );
      }
      if (selection.deselectedRows.length > 0) {
        const deselectedRows = selection.deselectedRows.map(
          (r: any) => r.dataItem.id
        );
        this.selectedRows = this.selectedRows.filter(
          (r: any) => !deselectedRows.includes(r)
        );
      }
    } else {
      this.selectedRows = selection.selectedRows.map((x: any) => x.dataItem.id);
    }
  }

  /**
   * Close the modal, indicating if update is required
   *
   * @param saveChanges is update required
   */
  closeModal(saveChanges: boolean = true): void {
    this.ref.tick();
    if (saveChanges) {
      this.dialogRef.close(this.selectedRows as any);
    }
  }
}
