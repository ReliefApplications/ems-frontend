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
 * UI Chip list directive
 */
@Directive({
  selector: '[uiChipList]',
})
export class ChipListDirective implements AfterContentInit, OnDestroy {
  @Input() uiChipList!: any;
  @Output() uiChipListChange = new EventEmitter<any>();

  private selectedChip!: any;
  private destroy$: Subject<void> = new Subject<void>();
  private currentChipList: any[] = [];

  /**
   * UI Chip list directive constructor
   *
   * @param renderer Renderer2
   * @param elementRef ElementRef
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    console.log('uiChipList', this.uiChipList);
    // Get all the ui-chip inside the element with the directive
    this.currentChipList =
      this.elementRef.nativeElement.querySelectorAll('ui-chip');
    console.log('currentChipList', this.currentChipList);

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
          if (selectedChipElement) {
            this.setChipSelected(selectedChipElement);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
