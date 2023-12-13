import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

/** TimePicker interface declaration */
export interface TimePickerModel {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * generate numbers in some range
 *
 * @param start start range
 * @param end end range
 * @yields i
 */
function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

/**
 * UI TimePicker Component
 */
@Component({
  selector: 'ui-cron-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {
  /** Whether time picker is disabled or not */
  @Input() public disabled = false;
  /** Whether to use 24 hour time or not */
  @Input() public use24HourTime = true;
  /** Whether to hide hours or not */
  @Input() public hideHours = false;
  /** Whether to hide minutes or not */
  @Input() public hideMinutes = false;
  /** Whether to hide seconds or not */
  @Input() public hideSeconds = true;

  /** Form group */
  allForm!: FormGroup;

  /** Minutes range */
  public minutes = [...range(0, 59)];
  /** Seconds range */
  public seconds = [...range(0, 59)];
  /** Hour types */
  public hourTypes = ['AM', 'PM'];

  /** @returns hours */
  get hours(): number[] {
    return this.use24HourTime ? [...range(0, 23)] : [...range(0, 12)];
  }

  /**
   * Ui TimePicker constructor
   *
   * @param parent parent ControlContainer
   */
  constructor(public parent: ControlContainer) {}

  ngOnInit(): void {
    this.allForm = this.parent.control as FormGroup;
  }
}
