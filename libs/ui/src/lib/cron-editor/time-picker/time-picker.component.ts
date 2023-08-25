import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroup} from '@angular/forms';

export interface TimePickerModel {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

@Component({
  selector: 'ui-cron-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Input() public disabled = false;
  @Input() public use24HourTime = true;
  @Input() public hideHours = false;
  @Input() public hideMinutes = false;
  @Input() public hideSeconds = true;

  allForm!: FormGroup;

  public minutes =  [...range(0, 59) ];
  public seconds = [...range(0, 59) ];
  public hourTypes = ['AM', 'PM'];

  get hours(): number[] {
    return this.use24HourTime ? [... range(0, 23)] : [... range(0, 12)];
  }

  constructor(public parent: ControlContainer) {}

  ngOnInit(): void {
    this.allForm = this.parent.control as FormGroup;
  }
}

