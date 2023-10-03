import {
  Component,
  Input,
  ContentChildren,
  forwardRef,
  QueryList,
  ElementRef,
  AfterContentInit,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * UI Select option component
 */
@Component({
  selector: 'ui-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent implements AfterContentInit {
  @Input() value!: any;
  @Input() selected = false;
  @Input() isGroup = false;
  @Input() disabled = false;

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

  /**
   * Set formatted value for list element
   *
   * @returns formatted value
   */
  get getValue() {
    return this.value ? JSON.stringify(this.value) : '';
  }

  ngAfterContentInit(): void {
    this.label = (this.el.nativeElement.firstChild?.textContent ?? '').trim();
  }
}
