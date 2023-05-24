import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Renderer2,
  OnDestroy,
  ElementRef,
  ContentChildren,
} from '@angular/core';
import { Observable, Subject, fromEvent, merge, takeUntil } from 'rxjs';
import { ButtonComponent } from './button.component';

/**
 * UI Button group directive
 */
@Directive({
  selector: '[uiButtonGroup]',
})
export class ButtonGroupDirective implements AfterContentInit, OnDestroy {
  @Input() uiButtonGroup!: any;
  @Output() uiButtonGroupChange = new EventEmitter<any>();

  @ContentChildren(ButtonComponent, { read: ElementRef })
  currentButtons: Array<ElementRef> = [];

  private selectedButton!: any;
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * UI Button directive constructor
   *
   * @param renderer Renderer2
   * @param elementRef ElementRef
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    // Add default classes to the host element of the directive to create the button group wrapper
    this.renderer.addClass(this.elementRef.nativeElement, 'w-max');
    this.renderer.addClass(this.elementRef.nativeElement, 'isolate');
    this.renderer.addClass(this.elementRef.nativeElement, 'inline-flex');
    this.renderer.addClass(this.elementRef.nativeElement, 'shadow-sm');

    const childrenEventStream: Observable<Event>[] = [];
    this.currentButtons.forEach((button: ElementRef) => {
      // Reset all buttons styling to button group(no rounded corner, tertiary type, and index priority)
      this.renderer.addClass(button.nativeElement.firstChild, 'focus:z-10');
      this.renderer.addClass(button.nativeElement.firstChild, 'rounded-none');
      this.renderer.addClass(button.nativeElement.firstChild, 'tertiary');
      //If value is already selected from the directive, apply changes
      if (this.uiButtonGroup === button.nativeElement.firstChild.value) {
        this.setButtonSelected(button.nativeElement.firstChild);
      }
      // Get all click event streams from the children buttons
      childrenEventStream.push(
        fromEvent(button.nativeElement.firstChild, 'click')
      );
    });
    this.setButtonEventsListener(childrenEventStream);
  }

  /**
   * Initialize button events callback
   *
   * @param buttonEventStream buttons event stream
   */
  private setButtonEventsListener(buttonEventStream: Observable<Event>[]) {
    merge(...buttonEventStream)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: Event) => {
          const selectedButtonElement =
            event?.currentTarget as HTMLButtonElement;
          if (selectedButtonElement) {
            this.setButtonSelected(selectedButtonElement);
          }
        },
      });
  }

  /**
   * Get the selected button and emits the value plus also updates the button children styling
   *
   * @param button selected button
   */
  private setButtonSelected(button: HTMLButtonElement) {
    // Reset all buttons styling
    this.currentButtons.forEach((button: any) => {
      this.renderer.removeClass(button.nativeElement.firstChild, 'secondary');
      this.renderer.removeClass(button.nativeElement.firstChild, 'text-white');
    });
    // Add selected class to the given button
    this.renderer.addClass(button, 'secondary');
    this.renderer.addClass(button, 'text-white');
    // Store selected value and emit it
    this.selectedButton = button.value;
    this.uiButtonGroupChange.emit(this.selectedButton);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
