import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Renderer2,
  ElementRef,
  OnDestroy,
  Optional,
} from '@angular/core';
import { FormWrapperDirective } from '../form-wrapper/form-wrapper.directive';

/**
 * UI Chip list linked to a input directive
 */
@Directive({
  selector: '[uiChipListFor]',
})
export class ChipInputDirective implements AfterContentInit, OnDestroy {
  @Input('uiChipListFor') chipList!: any;
  @Input() chipInputSeparatorKeyCodes: number[] = [];

  @Output() chipTokenEnd = new EventEmitter<string>();

  private inputListener!: () => void;
  private wrapperDivClasses = [
    'border-solid',
    'rounded-md',
    'border',
    'border-gray-200',
    'px-1',
    'py-2',
    'gap-1',
    'flex',
    'w-full',
    'flex-wrap',
  ] as const;

  /**
   * UI Chip input directive constructor
   *
   * @param formWrapperDirective form wrapper directive
   * @param renderer Renderer2
   * @param elementRef ElementRef
   */
  constructor(
    @Optional() private formWrapperDirective: FormWrapperDirective,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngAfterContentInit() {
    this.setWrapperDiv();
    // Add a listener to the input element to know when enter a separator key
    this.inputListener = this.renderer.listen(
      this.elementRef.nativeElement,
      'keydown',
      (event: any) => {
        const inputValue: string = this.elementRef.nativeElement.value;
        if (this.chipInputSeparatorKeyCodes.includes(event.keyCode)) {
          event.preventDefault();
          // Check if text input aren't empty
          if (inputValue.trim()) {
            // If separator key is there, remove it
            const newChip = inputValue.replace(new RegExp(event.keyCode), '');
            this.chipTokenEnd.emit(newChip);
          }
          this.elementRef.nativeElement.value = '';
        }
      }
    );
  }

  /**
   * Creates a new div to wrapper the chip list and the input element
   * and updates the styling
   */
  private setWrapperDiv(): void {
    const wrapper = this.renderer.createElement('div');
    const parent = this.elementRef.nativeElement.parentNode;
    this.renderer.addClass(this.elementRef.nativeElement, 'flex-1');
    // If no form wrapper directive to manage element insertion
    // We insert chip list in the default element configuration
    if (!this.formWrapperDirective) {
      this.renderer.insertBefore(
        parent,
        wrapper,
        this.elementRef.nativeElement
      );
      this.renderer.appendChild(wrapper, this.chipList);
      this.renderer.appendChild(wrapper, this.elementRef.nativeElement);
    }

    // Add classes to the chip list wrapper
    this.renderer.addClass(this.chipList, 'flex');
    this.renderer.addClass(this.chipList, 'flex-wrap');
    this.renderer.addClass(this.chipList, 'gap-1');

    this.wrapperDivClasses.forEach((divClass: string) => {
      this.renderer.addClass(wrapper, divClass);
    });
  }

  ngOnDestroy(): void {
    if (this.inputListener) {
      this.inputListener();
    }
  }
}
