import {
  Directive,
  Input,
  AfterContentInit,
  OnDestroy,
  forwardRef,
  ContentChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, filter, startWith, takeUntil } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChipComponent } from './chip.component';

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

  @ContentChildren(ChipComponent) currentChipList!: QueryList<ChipComponent>;
  private destroy$: Subject<void> = new Subject<void>();

  value: string[] = [];
  disabled = false;
  onChange!: (value: string[]) => void;
  onTouch!: () => void;

  /**
   * UI Chip list directive constructor
   *
   * @param cdr ChangeDetectorRef
   */
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.currentChipList.changes
      .pipe(
        startWith(this.currentChipList),
        filter(() => !this.disabled),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (chips: QueryList<ChipComponent>) => {
          const currentValues = chips.toArray().map((chip) => chip.value);
          this.writeValue(currentValues);
          if (this.onTouch && this.onChange) {
            this.onTouch();
            this.onChange(this.value);
          }
          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Write value of control.
   *
   * @param value new value
   */
  public writeValue(value: string[]): void {
    this.value = value;
  }

  /**
   * Register new method to call when control state change
   *
   * @param fn callback function
   */
  public registerOnChange(fn: (value: string[]) => void): void {
    if (!this.onChange) {
      this.onChange = fn;
    }
  }

  /**
   * Register new method to call when control touch state change
   *
   * @param fn callback function
   */
  public registerOnTouched(fn: () => void): void {
    if (!this.onTouch) {
      this.onTouch = fn;
    }
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // Disable/enable chips when form control disabled status changes
    this.currentChipList?.forEach((chip: ChipComponent) => {
      chip.disabled = isDisabled;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
