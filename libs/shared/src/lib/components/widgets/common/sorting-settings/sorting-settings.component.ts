import { BehaviorSubject } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';

/**
 * Widget sorting settings component.
 * Used by grid & summary card widgets, to sort the data.
 */
@Component({
  selector: 'shared-sorting-settings',
  templateUrl: './sorting-settings.component.html',
  styleUrls: ['./sorting-settings.component.scss'],
})
export class SortingSettingsComponent implements OnInit {
  /** Available fields */
  @Input() fields: any;
  /** Sorting fields form array */
  @Input() formArray!: FormArray;
  /** Widget settings form group */
  @Input() formGroup!: FormGroup;

  /** Displayed columns of table */
  public displayedColumnsApps = ['field', 'order', 'label', 'actions'];
  /** To make drag and drop work with table */
  public data!: BehaviorSubject<AbstractControl[]>;

  /** Available ordering */
  public orderList = [
    { value: 'asc', text: this.translate.instant('common.asc') },
    { value: 'desc', text: this.translate.instant('common.desc') },
  ];
  /** Enabled drag behavior, needed to set the drag on run time so cdkDragHandle directive works in the table */
  public dragEnabled = false;

  /**
   * Constructor for sorting-settings component
   *
   * @param fb FormBuilder instance
   * @param translate Angular translate service
   */
  constructor(private fb: FormBuilder, private translate: TranslateService) {}

  ngOnInit() {
    this.data = new BehaviorSubject<AbstractControl[]>(this.formArray.controls);
  }

  /**
   * Adds row to the table
   *
   */
  addRow(): void {
    const row = this.fb.group({
      field: [this.fields[0]?.name ?? '', Validators.required],
      order: [this.orderList[0].value, Validators.required],
      label: ['', Validators.required],
    });
    this.formArray.push(row);
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
   * Refreshes the table view
   */
  updateView(): void {
    this.data.next(this.formArray.controls);
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
