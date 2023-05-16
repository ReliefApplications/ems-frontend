import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableSort } from './interfaces/table-column.interface';

/**
 * UI Table Header sort directive
 */
@Directive({
  selector: '[uiTableHeaderSort]',
})
export class TableHeaderSortDirective implements AfterViewInit {
  @Input() uiTableHeaderSort = '';

  private descSortIcon = '↧' as const;
  private ascSortIcon = '↥' as const;

  sortIndicatorElement!: HTMLSpanElement;
  activeSort = new BehaviorSubject<TableSort | null>(null);

  /**
   * Handle host element click event
   */
  @HostListener('click')
  onClick() {
    let sortDirection: '' | 'asc' | 'desc' = '';
    if (this.sortIndicatorElement.textContent === '') {
      this.sortIndicatorElement.textContent = this.ascSortIcon;
      sortDirection = 'asc';
    } else if (this.sortIndicatorElement.textContent === this.ascSortIcon) {
      this.sortIndicatorElement.textContent = this.descSortIcon;
      sortDirection = 'desc';
    } else if (this.sortIndicatorElement.textContent === this.descSortIcon) {
      this.sortIndicatorElement.textContent = '';
    }
    this.activeSort.next({ active: this.uiTableHeaderSort, sortDirection });
  }

  /**
   * Ui Table Header sort constructor
   *
   * @param el Directive host element
   * @param renderer Renderer 2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Apply default pointer cursor and sort indicator element to the host element
    this.renderer.addClass(this.el.nativeElement, 'cursor-pointer');
    this.sortIndicatorElement = this.renderer.createElement('span');
    this.renderer.addClass(this.sortIndicatorElement, 'inline-block');
    this.renderer.addClass(this.sortIndicatorElement, 'pl-1');
    this.renderer.addClass(this.sortIndicatorElement, 'min-w-[11px]');
    this.sortIndicatorElement.textContent = '';
    this.renderer.appendChild(this.el.nativeElement, this.sortIndicatorElement);
  }
}
