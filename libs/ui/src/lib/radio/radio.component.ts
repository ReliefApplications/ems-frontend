import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RadioOrientation } from './enums/orientation.enum';

@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
  @Input() options: any[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() ariaLabelledby: string = '';
  @Input() orientation: RadioOrientation = RadioOrientation.HORIZONTAL
  @Input() name: string = '';
  @Output() onSelectOption: EventEmitter<any> = new EventEmitter();

  public radioOrientations = RadioOrientation;

}
