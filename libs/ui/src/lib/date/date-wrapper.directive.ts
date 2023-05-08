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
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Subject, merge, takeUntil } from 'rxjs';
import { DateRangeComponent } from './date-range/date-range.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerDirective } from './date-picker.directive';
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
  private dateInputListeners: any[] = [];

  /**
   * UI Date wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'relative');
    // If is a date range we would have two inputs, there for flex the parent component to display them inline
    if (this.uiDateWrapper instanceof DateRangeComponent) {
      this.renderer.addClass(this.el.nativeElement, 'flex');
      this.renderer.addClass(
        this.dateInputs.last['el'].nativeElement.parentElement,
        'ml-3'
      );
    }
    this.setDateCalendarListener();
    this.setCalendarDisplayPosition();
    this.setDateInputListeners();
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
    this.dateInputs.toArray().forEach((dateInput) => {
      dateInputClickEventStreams.push(dateInput.clickEvent);
    });
    merge(...dateInputClickEventStreams)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          (this.uiDateWrapper as any).showPanel = true;
        },
      });

    (this.uiDateWrapper as any).selectedValue
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value: Date | SelectionRange) => {
          if (this.uiDateWrapper instanceof DatePickerComponent) {
            this.dateInputs.first.setValue(value as Date);
          } else if (this.uiDateWrapper instanceof DateRangeComponent) {
            this.dateInputs.first.setValue((value as SelectionRange).start);
            if ((value as SelectionRange).end) {
              this.dateInputs.last.setValue((value as SelectionRange).end);
            }
          }
        },
      });
  }

  /**
   * Set calendar event listeners
   */
  private setDateInputListeners() {
    const listener = this.renderer.listen(
      this.dateInputs.first['el'].nativeElement,
      'change',
      (event) => {
        if (this.uiDateWrapper instanceof DateRangeComponent) {
          (this.uiDateWrapper as any).range.start = event?.target.valueAsDate;
        } else {
          (this.uiDateWrapper as any).value = event?.target.valueAsDate;
        }
      }
    );
    this.dateInputListeners.push(listener);
    if (this.uiDateWrapper instanceof DateRangeComponent) {
      const listener = this.renderer.listen(
        this.dateInputs.last['el'].nativeElement,
        'change',
        (event) => {
          (this.uiDateWrapper as any).range.end = event?.target.valueAsDate;
        }
      );
      this.dateInputListeners.push(listener);
    }
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
    this.dateInputListeners.forEach((listener) => {
      listener();
    });
  }
}
