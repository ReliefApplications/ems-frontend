import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Observable, Subject, Subscription, merge, takeUntil } from 'rxjs';
import { DateRangeComponent } from './date-range/date-range.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerDirective } from './date-picker.directive';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
/**
 * UI Date wrapper directive
 */
@Directive({
  selector: '[uiDateWrapper]',
})
export class DateWrapperDirective implements AfterContentInit, OnDestroy {
  @Input() uiDateWrapper!: DateRangeComponent | DatePickerComponent;
  @ContentChildren(DatePickerDirective)
  private dateInputs!: QueryList<DatePickerDirective>;

  private destroy$ = new Subject<void>();
  private outsideClickListener!: any;
  private dateInputListeners: any[] = [];
  private document!: Document;
  overlayRef!: OverlayRef;
  calendarClosingActionsSubscription!: Subscription;
  isCalendarOpen = false;

  /**
   * UI Date wrapper directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   * @param cdr ChangeDetectorRef
   * @param overlay Overlay
   * @param viewContainerRef ViewContainerRef
   * @param document Document
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) document: Document
  ) {
    this.document = document;
  }

  ngAfterContentInit(): void {
    // If is a date range we would have two inputs, there for flex the parent component to display them inline
    if (this.uiDateWrapper instanceof DateRangeComponent) {
      this.renderer.addClass(this.el.nativeElement, 'flex');
      this.renderer.addClass(
        this.dateInputs.last['el'].nativeElement.parentElement,
        'ml-3'
      );
    }
    this.setDateCalendarListener();
    this.setDateInputListeners();
  }

  /**
   * Set calendar event listeners
   */
  private setDateCalendarListener() {
    if (this.outsideClickListener) {
      this.outsideClickListener();
    }
    this.outsideClickListener = this.renderer.listen(
      'window',
      'click',
      (event) => {
        if (
          !(
            this.el.nativeElement.contains(event.target) ||
            this.document
              .getElementsByTagName('kendo-multiviewcalendar')
              .item(0)
              ?.contains(event.target) ||
            this.uiDateWrapper.viewChangeAction
          )
        ) {
          this.closeCalendar();
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
          this.openCalendar();
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
    this.dateInputListeners.forEach((listener) => {
      if (listener) {
        listener();
      }
    });
    const listener = this.renderer.listen(
      this.dateInputs.first['el'].nativeElement,
      'change',
      (event) => {
        if (this.uiDateWrapper instanceof DateRangeComponent) {
          (this.uiDateWrapper as any).range.start = event?.target.valueAsDate;
        } else {
          (this.uiDateWrapper as any).value = event?.target.valueAsDate;
        }
        this.cdr.detectChanges();
      }
    );
    this.dateInputListeners.push(listener);
    if (this.uiDateWrapper instanceof DateRangeComponent) {
      const listener = this.renderer.listen(
        this.dateInputs.last['el'].nativeElement,
        'change',
        (event) => {
          (this.uiDateWrapper as any).range.end = event?.target.valueAsDate;
          this.cdr.detectChanges();
        }
      );
      this.dateInputListeners.push(listener);
    }
  }

  /**
   * Set the overlay position origin taking in account the host element's position against screen boundaries
   *
   * @returns overlay positions array
   */
  private setOverlayOriginPosition(): ConnectedPosition[] {
    // As the menu is not displayed yet, we set a default value to check element boundaries
    const defaultCheckValue = 300;
    // Is the host element nearby the bottom edge of the screen
    const isBottomEdge =
      window.innerHeight - this.el.nativeElement.getBoundingClientRect().top <
      defaultCheckValue;
    // Is the host element nearby the right edge of the screen
    const isRightEdge =
      window.innerWidth - this.el.nativeElement.getBoundingClientRect().right <
      defaultCheckValue;
    return [
      {
        originX: isRightEdge ? 'end' : 'start',
        originY: isBottomEdge ? 'top' : 'bottom',
        overlayX: isRightEdge ? 'end' : 'start',
        overlayY: isBottomEdge ? 'bottom' : 'top',
        offsetX: 0,
        offsetY: 5,
      },
    ];
  }

  /**
   * Open the associated calendar
   */
  openCalendar(): void {
    if (!this.isCalendarOpen) {
      this.isCalendarOpen = true;
      const overlayOriginPosition = this.setOverlayOriginPosition();
      // We create an overlay for the displayed calendar
      this.overlayRef = this.overlay.create({
        hasBackdrop: false,
        // close calendar on user scroll - default behavior, could be changed
        scrollStrategy: this.overlay.scrollStrategies.close(),
        // We position the displayed calendar taking current directive host element as reference
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.el)
          .withPositions(overlayOriginPosition),
      });
      // Create the template portal for the current calendar
      const templatePortal = new TemplatePortal(
        this.uiDateWrapper.calendar,
        this.viewContainerRef
      );
      // Attach it to our overlay
      this.overlayRef.attach(templatePortal);
      // We add the needed classes to create the animation on calendar display
      setTimeout(() => {
        this.applyCalendarDisplayAnimation(true);
      }, 0);
      // Subscribe to all actions that close the calendar
      this.calendarClosingActionsSubscription =
        this.calendarClosingActions().subscribe(
          // If so, close calendar
          () => this.closeCalendar()
        );
    }
  }

  /**
   * Actions linked to the destruction of the current displayed calendar
   *
   * @returns Observable of actions
   */
  private calendarClosingActions(): Observable<MouseEvent | void> {
    const detachment$ = this.overlayRef.detachments();
    return merge(detachment$);
  }

  /**
   * Close the current calendar
   */
  private closeCalendar(): void {
    if (!this.overlayRef || !this.isCalendarOpen) {
      return;
    }
    // Unsubscribe to our close action subscription
    this.calendarClosingActionsSubscription.unsubscribe();
    this.isCalendarOpen = false;
    // We remove the needed classes to create the animation on calendar close
    this.applyCalendarDisplayAnimation(false);
    // Detach the previously created overlay for the calendar
    setTimeout(() => {
      this.overlayRef.detach();
    }, 100);
  }

  /**
   * Apply animation to displayed calendar
   *
   * @param toDisplay If the calendar is going to be displayed or not
   */
  private applyCalendarDisplayAnimation(toDisplay: boolean) {
    // The overlayElement is the immediate parent element containing the calendar,
    // therefor we want the immediate child in where we would apply the classes
    const calendar = this.overlayRef.overlayElement.querySelector(
      'kendo-multiviewcalendar'
    );
    if (toDisplay) {
      this.renderer.addClass(calendar, 'translate-y-0');
      this.renderer.addClass(calendar, 'opacity-100');
    } else {
      this.renderer.removeClass(calendar, 'translate-y-0');
      this.renderer.removeClass(calendar, 'opacity-100');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.outsideClickListener) {
      this.outsideClickListener();
    }
    this.dateInputListeners.forEach((listener) => {
      if (listener) {
        listener();
      }
    });
  }
}
