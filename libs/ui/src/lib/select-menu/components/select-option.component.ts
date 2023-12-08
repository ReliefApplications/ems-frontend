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
  @Input() value!: any;
  @Input() selected = false;
  @Input() isGroup = false;
  @Input() disabled = false;
  @Output() optionClick = new EventEmitter<boolean>();

  @ContentChildren(forwardRef(() => SelectOptionComponent))
  options!: QueryList<SelectOptionComponent>;

  label!: string;
  // If current option content should be displayed or not in the UI
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
