import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Renderer2,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Observable, Subject, fromEvent, merge, takeUntil } from 'rxjs';

/**
 * UI Button group directive
 */
@Directive({
  selector: '[uiButtonGroup]',
})
export class ButtonGroupDirective implements AfterContentInit, OnDestroy {
  @Input() uiButtonGroup!: any;
  @Output() uiButtonGroupChange = new EventEmitter<any>();

  private selectedButton!: any;
  private destroy$: Subject<void> = new Subject<void>();
  private currentButtons: any[] = [];

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

    // Get all the ui-buttons inside the element with the directive
    this.currentButtons =
      this.elementRef.nativeElement.querySelectorAll('ui-button');
    const childrenEventStream: Observable<Event>[] = [];
    this.currentButtons.forEach((button: any) => {
      // Reset all buttons styling to button group(no rounded corner, tertiary type, and index priority)
      this.renderer.addClass(button.firstChild, 'focus:z-10');
      this.renderer.addClass(button.firstChild, 'rounded-none');
      this.renderer.addClass(button.firstChild, 'tertiary');
      //If value is already selected from the directive, apply changes
      if (this.uiButtonGroup === button.firstChild.value) {
        this.setButtonSelected(button.firstChild);
      }
      // Get all click event streams from the children buttons
      childrenEventStream.push(fromEvent(button, 'click'));
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
          const selectedButtonElement = (
            event?.currentTarget as HTMLElement
          ).querySelector('button');
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
      this.renderer.removeClass(button.firstChild, 'secondary');
      this.renderer.removeClass(button.firstChild, 'text-white');
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
