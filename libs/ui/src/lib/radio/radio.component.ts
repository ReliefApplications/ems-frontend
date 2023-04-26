import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent {
  @Input() options: any[] = [];
  @Input() disabled = false;
  @Input() required = false;
  @Input() ariaLabelledby = '';
  @Input() name = '';
  @Input() value = '';
  @Input() checked = false;
}
