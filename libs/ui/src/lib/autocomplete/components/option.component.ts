import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  forwardRef,
} from '@angular/core';

/**
 * UI Option component
 */
@Component({
  selector: 'ui-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent {
  /** Value of the option. */
  @Input() value!: any;
  /** Label for the option */
  @Input() label? = '';
  /** Whether it is a group or not */
  @Input() isGroup = false;
  /** List of options */
  @ContentChildren(forwardRef(() => OptionComponent))
  options!: QueryList<OptionComponent>;

  /** Whether the option is selected or not */
  selected = false;
  /** Whether the option is displayed or not */
  display = true;

  /**
   * Set formatted value for list element
   *
   * @returns formatted value
   */
  get getValue() {
    return this.value ? JSON.stringify(this.value) : '';
  }
}
