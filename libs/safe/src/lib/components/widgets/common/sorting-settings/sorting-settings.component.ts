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

/** Component for managing the widget sorting options */
@Component({
  selector: 'safe-sorting-settings',
  templateUrl: './sorting-settings.component.html',
  styleUrls: ['./sorting-settings.component.scss'],
})
export class SafeSortingSettingsComponent implements OnInit {
  @Input() fields: any;
  @Input() formArray!: FormArray;
  @Input() formGroup!: FormGroup;

  /** Displayed columns of table */
  public displayedColumnsApps = ['field', 'order', 'label', 'actions'];
  public data!: BehaviorSubject<AbstractControl[]>; // to make drag and drop work with table

  public orderList = [
    { value: 'asc', text: 'ASC' },
    { value: 'desc', text: 'DESC' },
  ];

  /**
   * Constructor for sorting-settings component
   *
   * @param fb FormBuilder instance
   */
  constructor(private fb: FormBuilder) {}

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
