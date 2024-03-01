import {
  Component,
  EventEmitter,
  Input,
  Output,
  ContentChildren,
  forwardRef,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

/**
 * UI Select option component
 */
@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
})
export class SelectOptionComponent implements AfterViewInit {
  /** Option value */
  @Input() value!: any;
  /** Option selected */
  @Input() selected = false;
  /** Option group */
  @Input() isGroup = false;
  /** Option disabled */
  @Input() disabled = false;
  /** Option click event emitter */
  @Output() optionClick = new EventEmitter<boolean>();

  /** List of options */
  @ContentChildren(forwardRef(() => SelectOptionComponent))
  options!: QueryList<SelectOptionComponent>;

  /** Option label */
  label!: string;
  /** If current option content should be displayed or not in the UI */
  display = true;

  /**
   *
   * UI Select option constructor
   *
   * @param el ElementRef
   */
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.label =
      this.el.nativeElement
        .querySelector('span')
        .firstChild?.textContent?.trim() ?? '';
  }

  /**
   * Emit optionClick output and updates option selected status
   */
  onChangeFunction(): void {
    if (this.isGroup || this.disabled) {
      return;
    }
    this.selected = !this.selected;
    this.optionClick.emit(this.selected);
  }
}
