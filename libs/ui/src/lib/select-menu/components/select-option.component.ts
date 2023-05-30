import {
  Component,
  EventEmitter,
  Input,
  Output,
  ContentChildren,
  forwardRef,
  QueryList,
  AfterViewInit,
  ElementRef,
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
  @Output() optionClick = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SelectOptionComponent))
  options!: QueryList<SelectOptionComponent>;

  label!: string;

  /**
   *
   * UI Select option constructor
   *
   * @param el ElementRef
   */
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Set the text content of each option
    this.label =
      this.el.nativeElement.querySelector('span').firstChild.textContent;
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
