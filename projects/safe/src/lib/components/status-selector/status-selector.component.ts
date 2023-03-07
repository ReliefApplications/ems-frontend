import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
} from '@angular/forms';

/**
 * Custom component for the status selector
 *
 * @class StatusSelectorComponent
 * @typedef {StatusSelectorComponent}
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 */
@Component({
  selector: 'safe-status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusSelectorComponent),
      multi: true,
    },
  ],
})
export class StatusSelectorComponent implements OnInit, ControlValueAccessor {
  /**
   * Variable that controls the appearence of the status chip
   *
   * @public
   * @type {*}
   */
  public status: any;
  /**
   * Variable that controls if the edit icon is visible
   *
   * @public
   * @type {boolean}
   */
  public hovering = false;
  /**
   * Variable that controls if the status list is visible
   *
   * @public
   * @type {boolean}
   */
  public editing = false;
  /**
   * List of selectable statuses for the mat-list
   *
   * @public
   * @type {{}}
   */
  public statusList = [
    { name: 'Active', status: 'active' },
    { name: 'Pending', status: 'pending' },
    { name: 'Archived', status: 'archived' },
  ];
  /**
   *
   *
   * @public
   * @type { [key: string]: { name: string; status: string } }
   */
  public statusChoices: { [key: string]: { name: string; status: string } } = {
    blank: { name: '', status: 'undefined' },
    active: { name: 'Active', status: 'active' },
    pending: { name: 'Pending', status: 'pending' },
    archived: { name: 'Archived', status: 'archived' },
  };

  /**
   * Description placeholder
   *
   * @type {!UntypedFormControl}
   */
  @Input() formControl!: UntypedFormControl;

  /**
   * Description placeholder
   *
   * @type {!string}
   */
  @Input() formControlName!: string;

  /**
   * Description placeholder
   *
   * @private
   * @type {!*}
   */
  private onTouched!: any;
  /**
   * Description placeholder
   *
   * @private
   * @type {!*}
   */
  private onChanged!: any;
  /**
   * Description placeholder
   *
   * @public
   * @type {boolean}
   */
  public disabled = false;

  /**
   * Creates an instance of StatusSelectorComponent.
   */
  constructor() {}

  /**
   * NgOnInit
   */
  ngOnInit(): void {
    //console.log(this.formControl);
    //this.status = this.statusChoices[this.currentStatus.value];
  }

  /**
   * Description placeholder
   *
   * @param {*} value Value
   */
  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  /**
   * Description placeholder
   *
   * @param {*} fn Fn
   */
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Description placeholder
   *
   * @param {*} fn Fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Description placeholder
   *
   * @param {boolean} isDisabled isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Method that controls 'editing variable'
   */
  onEdit(): void {
    this.editing = !this.editing;
  }
  /**
   * Method that switches the appearance of the chip
   *
   * @param {*} item Selected Item
   */
  onSelect(item: any): void {
    this.editing = false;
    this.status = {
      name: item.name,
      status: item.status,
    };
  }
}
