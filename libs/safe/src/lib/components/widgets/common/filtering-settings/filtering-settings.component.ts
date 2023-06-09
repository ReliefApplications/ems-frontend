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

/** Component for managing the widget filtering options */
@Component({
  selector: 'safe-filtering-settings',
  templateUrl: './filtering-settings.component.html',
  styleUrls: ['./filtering-settings.component.scss'],
})
export class SafeFilteringSettingsComponent implements OnInit {
  @Input() layout: any;
  @Input() formArray!: FormArray;

  /** Displayed columns of table */
  public displayedColumnsApps = ['field', 'order', 'label', 'actions'];
  public formGroup!: FormGroup;
  public data!: BehaviorSubject<AbstractControl[]>;

  public orderList = [
    { value: 'asc', text: 'ASC' },
    { value: 'desc', text: 'DESC' },
  ];

  /**
   * Constructor for filtering-settings component
   *
   * @param formBuilder FormBuilder instance
   */
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      sortFields: this.formArray,
    });
    this.data = new BehaviorSubject<AbstractControl[]>(this.formArray.controls);
  }

  /**
   * Adds row to the table
   *
   */
  addRow(): void {
    const row = this.formBuilder.group({
      field: [this.layout.query.fields[0].name, Validators.required],
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
