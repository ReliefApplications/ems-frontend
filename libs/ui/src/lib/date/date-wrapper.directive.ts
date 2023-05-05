import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { DateRangeComponent } from './date-range/date-range.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerDirective } from './date-picker.directive';
import { Subject, merge, takeUntil } from 'rxjs';

/**
 * UI Date wrapper directive
 */
@Directive({
  selector: '[uiDateWrapper]',
})
export class DateWrapperDirective implements AfterContentInit, OnDestroy {
  @Input() uiDateWrapper!: TemplateRef<
    DateRangeComponent | DatePickerComponent
  >;
  @ContentChildren(DatePickerDirective)
  private dateInputs!: QueryList<DatePickerDirective>;

  private destroy$ = new Subject<void>();
  private outsideClickListener!: any;

  /**
   * UI Date wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'relative');
    if (this.dateInputs.toArray().length > 1) {
      this.renderer.addClass(this.el.nativeElement, 'flex');
    }
    this.setCalendarDisplayPosition();
    this.setDateCalendarListener();
  }

  /**
   * Set calendar event listeners
   */
  private setDateCalendarListener() {
    this.outsideClickListener = this.renderer.listen(
      'window',
      'click',
      (ev: Event) => {
        if (!this.el.nativeElement.contains(ev.target)) {
          (this.uiDateWrapper as any).showPanel = false;
        }
      }
    );
    const dateInputClickEventStreams: EventEmitter<void>[] = [];

    this.dateInputs.toArray().forEach((input) => {
      dateInputClickEventStreams.push(input.clickEvent);
    });

    merge(...dateInputClickEventStreams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          (this.uiDateWrapper as any).showPanel = true;
        },
      });
  }

  /**
   * Set the calendar display position origin taking in account the host element's position against screen boundaries
   */
  private setCalendarDisplayPosition(): void {
    // As the menu is not displayed yet, we set a default value to check element boundaries
    const defaultCheckValue = 200;
    // Is the host element nearby the bottom edge of the screen
    const isBottomEdge =
      window.innerHeight - this.el.nativeElement.getBoundingClientRect().top <
      defaultCheckValue;
    if (isBottomEdge) {
      this.renderer.setStyle(
        this.uiDateWrapper.elementRef.nativeElement,
        'top',
        `-${this.uiDateWrapper.elementRef.nativeElement.clientHeight}px`
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.outsideClickListener();
  }
}
