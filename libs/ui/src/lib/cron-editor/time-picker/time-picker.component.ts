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
  @Input() public disabled = false;
  @Input() public use24HourTime = true;
  @Input() public hideHours = false;
  @Input() public hideMinutes = false;
  @Input() public hideSeconds = true;

  allForm!: FormGroup;

  public minutes = [...range(0, 59)];
  public seconds = [...range(0, 59)];
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
