import {
  Directive,
  Input,
  AfterContentInit,
  forwardRef,
  ContentChildren,
  QueryList,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from '@angular/core';
import { filter, startWith } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChipComponent } from './chip.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  implements AfterContentInit, ControlValueAccessor
{
  /** Chip List */
  @Input() uiChipList!: any;
  /** Current chip list */
  @ContentChildren(ChipComponent) currentChipList!: QueryList<ChipComponent>;
  /** Current chip list value */
  value: string[] = [];
  /** Disabled state */
  disabled = false;
  /** Callback function to call when control state change */
  onChange!: (value: string[]) => void;
  /** Callback function to call when control touch state change */
  onTouch!: () => void;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

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
        takeUntilDestroyed(this.destroyRef)
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
}
