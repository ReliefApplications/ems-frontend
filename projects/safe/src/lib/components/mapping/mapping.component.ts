import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Mapping, Mappings } from '../../models/setting.model';
import { createFormGroup } from './mapping-forms';
import { SafeMappingModalComponent } from './mapping-modal/mapping-modal.component';

/**
 * Mapping component to handle all mapping grids.
 */
@Component({
  selector: 'safe-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
})
export class SafeMappingComponent implements OnInit, OnDestroy {
  // === DATA ===
  @Input() mappingForm!: FormArray;
  private mappingSubscription?: Subscription;
  // === TABLE ===
  displayedColumns = ['field', 'path', 'value', 'text', 'actions'];
  dataSource = new MatTableDataSource<Mapping>([]);

  /**
   * Mapping component constructor.
   *
   * @param dialog Angular Material dialog service.
   */
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = [...this.mappingForm.value];
    this.mappingSubscription = this.mappingForm.valueChanges.subscribe(
      (mappings: Mappings) => {
        this.dataSource.data = [...mappings];
      }
    );
  }

  /**
   * Open a modal to edit current row.
   *
   * @param element selected mapping row to edit.
   * @param index index of the mapping row to edit.
   */
  onEdit(element: Mapping, index: number): void {
    const dialogRef = this.dialog.open(SafeMappingModalComponent, {
      data: {
        mapping: element,
      },
    });
    dialogRef.afterClosed().subscribe((mapping: Mapping) => {
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
  onAdd(): void {
    const dialogRef = this.dialog.open(SafeMappingModalComponent, {
      data: {
        mapping: null,
      },
    });
    dialogRef.afterClosed().subscribe((mapping: Mapping) => {
      if (mapping) {
        this.mappingForm.push(createFormGroup(mapping));
        this.mappingForm.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mappingSubscription) this.mappingSubscription.unsubscribe();
  }
}
