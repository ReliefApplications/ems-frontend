import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Renderer2,
  ElementRef,
} from '@angular/core';

/**
 * UI Chip list linked to a input directive
 */
@Directive({
  selector: '[uiChipListFor]',
})
export class ChipInputDirective implements AfterContentInit {
  @Input('uiChipListFor') chipList!: any;
  @Input() chipInput!: any;
  @Input() chipInputSeparatorKeyCodes: number[] = [];

  @Output() chipTokenEnd = new EventEmitter<string>();

  private wrapperDivClasses = [
    'border-solid',
    'rounded-md',
    'border',
    'border-gray-200',
    'p-1',
    'gap-1',
    'flex',
    'w-full',
    'flex-wrap',
  ] as const;

  /**
   * UI Chip input directive constructor
   *
   * @param renderer Renderer2
   * @param elementRef ElementRef
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    this.setWrapperDiv();
    // Add a listener to the input element to know when enter a separator key
    this.chipInput.addEventListener('keydown', (event: any) => {
      let value = this.chipInput.value;
      if (this.chipInputSeparatorKeyCodes.includes(event.keyCode)) {
        event.preventDefault();
        // Check if text input aren't empty
        if (value.trim()) {
          // If separator key is there, remove it
          value = this.chipInputSeparatorKeyCodes.includes(value.slice(-1))
            ? value.substr(0, value.length - 1)
            : value;
          this.chipTokenEnd.emit(value);
        }
        this.chipInput.value = '';
      }
    });
  }

  /**
   * Creates a new div to wrapper the chip list and the input element
   * and updates the styling
   */
  private setWrapperDiv(): void {
    const wrapper = this.renderer.createElement('div');
    const parent = this.elementRef.nativeElement.parentNode;
    this.renderer.insertBefore(parent, wrapper, this.chipInput);
    this.renderer.appendChild(wrapper, this.chipList);
    this.renderer.appendChild(wrapper, this.chipInput);

    // Add classes to the chip list wrapper
    this.renderer.addClass(this.chipList, 'flex');
    this.renderer.addClass(this.chipList, 'flex-wrap');
    this.renderer.addClass(this.chipList, 'gap-1');

    this.wrapperDivClasses.forEach((divClass: string) => {
      this.renderer.addClass(wrapper, divClass);
    });
  }
}
