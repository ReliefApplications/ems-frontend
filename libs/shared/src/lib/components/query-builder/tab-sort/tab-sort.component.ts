import { Component, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { createSortRowForm } from '../query-builder-forms';

/**
 * Sorting definition of query builder component.
 */
@Component({
  selector: 'shared-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class TabSortComponent {
  /** Sort form group (parent query form, scoped into via the "sort" control) */
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  /** Available fields */
  @Input() fields: any[] = [];
  /** Show limit control, to limit the number of items to query */
  @Input() showLimit = false;

  /** @returns the sort rows form array */
  get sortRows(): UntypedFormArray {
    return this.form.get('sort') as UntypedFormArray;
  }

  /**
   * Adds a new, empty sort row.
   */
  addRow(): void {
    this.sortRows.push(createSortRowForm(null));
  }

  /**
   * Removes a sort row. If it's the only remaining row, clears it instead of
   * removing it, so a sort row is always present, matching the historical
   * single-field UI behavior.
   *
   * @param index Index of the row to remove
   */
  removeRow(index: number): void {
    if (this.sortRows.length > 1) {
      this.sortRows.removeAt(index);
    } else {
      this.sortRows.at(0).reset({ field: '', order: 'asc' });
    }
  }

  /**
   * Reorders the sort rows by priority. Moves the actual control instances
   * (not just their values) so the *ngFor repeater picks up the new order
   * and the on-screen controls refresh immediately - swapping values in
   * place would leave each row's bound control at the same position, so the
   * displayed selection wouldn't update until the form was reloaded.
   *
   * @param event Drop event
   */
  drop(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.sortRows.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.sortRows.updateValueAndValidity();
  }
}
