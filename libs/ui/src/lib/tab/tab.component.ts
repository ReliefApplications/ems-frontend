import { Component, ElementRef, Input } from '@angular/core';
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
  colorVariant = Variant;

  elRef: ElementRef;

  /**
   * Constructs the reference to the DOM of the tab
   *
   * @param elRef elementReference
   */
  constructor(elRef: ElementRef) {
    this.elRef = elRef;
  }

  @Input() label!: string;
  @Input() variant: Variant = this.colorVariant.DEFAULT;
}
