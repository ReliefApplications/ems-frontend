import {
  AfterContentInit,
  Directive,
  ElementRef,
  Renderer2,
} from '@angular/core';

/**
 * Ui Table Directive
 */
@Directive({
  selector: '[uiTableStyle]',
})
export class TableDirective implements AfterContentInit {
  /**
   * Constructor of ui table directive
   *
   * @param el Reference to element linked to the directive
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  tableClasses = ['min-w-full', 'divide-y', 'divide-gray-300'];
  tbodyClasses = ['divide-y', 'divide-gray-200', 'bg-white'];

  ngAfterContentInit(): void {
    for (const cl of this.tableClasses) {
      this.renderer.addClass(this.el.nativeElement, cl);
    }

    const body = this.el.nativeElement.querySelector('tbody');
    for (const cl of this.tbodyClasses) {
      this.renderer.addClass(body, cl);
    }
  }
}
