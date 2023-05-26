import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
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
  @Input() label: any = '';
  @Input() isGroup = false;
  @Output() itemClick = new EventEmitter<any>();
  @ContentChildren(forwardRef(() => OptionComponent))
  options!: QueryList<OptionComponent>;

  selected = false;
  display = true;

  /**
   * Emit the value attribute of the option
   */
  onClickItem() {
    if (this.isGroup) {
      return;
    }
    this.selected = !this.selected;
    this.itemClick.emit(this.selected);
  }
}
