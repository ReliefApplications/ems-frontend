import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  @Input() minValue = 0;
  @Input() maxValue = 100;
}
