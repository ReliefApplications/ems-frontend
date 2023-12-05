import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { createFormGroup, Mapping, Mappings } from './mapping-forms';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Mapping component to handle all mapping grids.
 */
@Component({
  selector: 'shared-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
})
export class MappingComponent extends UnsubscribeComponent implements OnInit {
  /** Input decorator for mappingForm. */
  @Input() mappingForm!: UntypedFormArray;
  /** Array of column names to be displayed in the table. */
  displayedColumns = ['field', 'path', 'value', 'text', 'actions'];
  /** Array to hold the data source for the table. */
  dataSource = new Array<Mapping>();

  /**
   * Mapping component constructor.
   *
   * @param dialog Angular Dialog service.
   */
  constructor(private dialog: Dialog) {
    super();
  }

  /** OnInit lifecycle hook. */
  ngOnInit(): void {
    this.dataSource = [...this.mappingForm.value];
    this.mappingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappings: Mappings) => {
        this.dataSource = [...mappings];
      });
  }

  /**
   * Open a modal to edit current row.
   *
   * @param element selected mapping row to edit.
   * @param index index of the mapping row to edit.
   */
  async onEdit(element: Mapping, index: number): Promise<void> {
    const { MappingModalComponent } = await import(
      './mapping-modal/mapping-modal.component'
    );
    const dialogRef = this.dialog.open(MappingModalComponent, {
      data: {
        mapping: element,
      },
    });
    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapping: any) => {
        if (mapping) {
          this.mappingForm.at(index).setValue(mapping);
          this.mappingForm.markAsDirty();
        }
      });
  }

  /**
   * Remove current row.
   *
   * @param index index of the mapping row to remove.
   */
  onDelete(index: number): void {
    this.mappingForm.removeAt(index);
    this.mappingForm.markAsDirty();
  }

  /**
   * Open a modal to add a new mapping row.
   */
  async onAdd(): Promise<void> {
    const { MappingModalComponent } = await import(
      './mapping-modal/mapping-modal.component'
    );
    const dialogRef = this.dialog.open(MappingModalComponent, {
      data: {
        mapping: null,
      },
    });
    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapping: any) => {
        if (mapping) {
          this.mappingForm.push(createFormGroup(mapping));
          this.mappingForm.markAsDirty();
        }
      });
  }
}
