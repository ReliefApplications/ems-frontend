import {
  Directive,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  Renderer2,
  OnDestroy,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { Observable, Subject, fromEvent, merge, takeUntil } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * UI Chip list directive
 */
@Directive({
  selector: '[uiChipList]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipListDirective),
      multi: true,
    },
  ],
})
export class ChipListDirective
  implements AfterContentInit, OnDestroy, ControlValueAccessor
{
  @Input() uiChipList!: any;
  @Output() uiChipListChange = new EventEmitter<any>();

  private selectedChip!: any;
  private destroy$: Subject<void> = new Subject<void>();
  private currentChipList: any[] = [];

  value = '';
  disabled = false;
  onChange!: (value: any) => void;
  onTouch!: () => void;

  /**
   * UI Chip list directive constructor
   *
   * @param renderer Renderer2
   * @param elementRef ElementRef
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    // Get all the ui-chip inside the element with the directive
    this.currentChipList =
      this.elementRef.nativeElement.querySelectorAll('ui-chip');

    const childrenEventStream: Observable<Event>[] = [];
    this.currentChipList.forEach((chip: any) => {
      //If value is already selected from the directive, apply changes
      if (this.uiChipList === chip.firstChild.dataset.value) {
        this.setChipSelected(chip.firstChild);
      }
      // Get all click event streams from the children chips
      childrenEventStream.push(fromEvent(chip, 'click'));
    });
    this.setChipsEventsListener(childrenEventStream);
  }

  /**
   * Get the selected chip and emits the value
   *
   * @param chip selected chip
   */
  private setChipSelected(chip: HTMLDivElement) {
    // Store selected value and emit it
    this.selectedChip = chip.dataset['value'];
    this.uiChipListChange.emit(this.selectedChip);
    // Handles with the control value accessor functions
    if (this.onTouch && this.onChange) {
      this.onTouch();
      this.onChange(this.selectedChip);
    }
  }

  /**
   * Initialize chip events callback
   *
   * @param chipEventStream chips event stream
   */
  private setChipsEventsListener(chipEventStream: Observable<Event>[]) {
    merge(...chipEventStream)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: Event) => {
          const selectedChipElement = (
            event?.currentTarget as HTMLElement
          ).querySelector('div');
          // Check if click was in the div of the chip selected
          if (event?.target instanceof HTMLDivElement && selectedChipElement) {
            this.setChipSelected(selectedChipElement);
          }
        },
      });
  }

  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: string): void {
    this.value = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
