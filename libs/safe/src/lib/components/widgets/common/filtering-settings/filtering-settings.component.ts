import { BehaviorSubject } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
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

  /** Displayed columns of table */
  public displayedColumnsApps = ['field', 'order', 'label', 'actions'];

  public items = [
    { field: 'name', order: 'asc', label: 'label1' },
    { field: 'height', order: 'desc', label: 'label2' },
  ];

  public rows: FormArray = this.formBuilder.array([]);
  public formGroup: FormGroup = this.formBuilder.group({ filters: this.rows });
  public data = new BehaviorSubject<AbstractControl[]>(this.rows.controls);

  /**
   * Constructor for filtering-settings component
   *
   * @param formBuilder FormBuilder instance
   */
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.items.forEach((item: any) => this.addRow(item, false));
    this.updateView();
  }

  /**
   * Adds row to the table
   *
   * @param item items values
   * @param noUpdate is a refresh needed
   */
  addRow(item?: any, noUpdate?: boolean): void {
    const row = this.formBuilder.group({
      field: item ? item.field : '',
      order: item ? item.order : '',
      label: item ? item.label : '',
    });
    this.rows.push(row);
    if (!noUpdate) this.updateView();
  }

  /**
   * Refreshes the table view
   */
  updateView(): void {
    this.data.next(this.rows.controls);
  }

  /**
   * Handles the dropping of the field in a container
   *
   * @param event The event involved in the drop
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.rows.controls,
      event.previousIndex,
      event.currentIndex
    );
    this.updateView();
  }
}
