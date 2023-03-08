import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
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
   * Form from parent component
   *
   * @public
   * @type {!FormGroup}
   */
  @Input() public parentForm!: FormGroup;

  /**
   * value for ControlValueAccessor
   *
   * @public
   * @type {!string}
   */
  public value!: string;

  /**
   * changed for ControlValueAccessor
   *
   * @public
   * @type {!(value: string) => void}
   */
  public changed!: (value: string) => void;

  /**
   * touched for ControlValueAccessor
   *
   * @public
   * @type {!() => void}
   */
  public touched!: () => void;

  /**
   * isDisabled for ControlValueAccessor
   *
   * @public
   * @type {!boolean}
   */
  public isDisabled!: boolean;

  /**
   * status data for chip/button
   *
   * @public
   * @type {*}
   */
  public status: any;

  /**
   * property which detects mouse hover
   *
   * @public
   * @type {boolean}
   */
  public hovering = false;

  /**
   * property which enables the status options list
   *
   * @public
   * @type {boolean}
   */
  public editing = false;

  /**
   * status data for status options list
   *
   * @public
   * @type {{}}
   */
  public statusDisplayList = [
    { name: 'common.status_active', status: 'active' },
    { name: 'common.status_pending', status: 'pending' },
    { name: 'common.status_archived', status: 'archived' },
  ];

  /**
   * status data for chip/button initialization
   *
   * @public
   * @type {{}}
   */
  public statusChoices: { [key: string]: { name: string; status: string } } = {
    blank: { name: 'status', status: '' },
    active: { name: 'common.status_active', status: 'active' },
    pending: { name: 'common.status_pending', status: 'pending' },
    archived: { name: 'common.status_archived', status: 'archived' },
  };

  /**
   * Creates an instance of StatusSelectorComponent.
   */
  constructor() {}

  /**
   * onInit which assigns status value from parent
   */
  ngOnInit(): void {
    if (this.parentForm.controls.status.value === '') {
      this.status = this.statusChoices.blank;
    } else {
      this.status = this.statusChoices[this.parentForm.controls.status.value];
    }
  }

  /**
   * writeValue for ControlValueAccessor
   *
   * @public
   * @param {string} value value
   */
  public writeValue(value: string): void {
    this.value = value;
  }

  /**
   * registerOnChange for ControlValueAccessor
   *
   * @param {*} fn fn
   */
  registerOnChange(fn: any): void {
    this.changed = fn;
  }

  /**
   * registerOnTouched for ControlValueAccessor
   *
   * @param {*} fn fn
   */
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  /**
   * SetDisabledState for ControlValueAccessor
   *
   * @param {boolean} isDisabled isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Method that controls 'editing' property
   */
  onEdit(): void {
    this.editing = !this.editing;
  }

  /**
   * Method that updates the status value
   *
   * @param {*} chip  Selected option
   */
  onSelect(chip: any): void {
    this.editing = false;
    this.status = {
      name: chip.name,
      status: chip.status,
    };
    this.parentForm.controls.status.patchValue(chip.status);
  }
}
