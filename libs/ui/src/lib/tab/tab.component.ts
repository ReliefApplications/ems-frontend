import { Component, Input } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Tab Component : It is not usable without being inside a navigation tab
 */
@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  ColorVariant = Variant;

  @Input() label!: string;
  @Input() variant: Variant = this.ColorVariant.DEFAULT;
}
