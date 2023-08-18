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
  @Input() value!: any;
  @Input() label? = '';
  @Input() isGroup = false;
  @ContentChildren(forwardRef(() => OptionComponent))
  options!: QueryList<OptionComponent>;

  selected = false;
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
