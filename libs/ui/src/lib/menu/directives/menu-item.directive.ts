import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * UI Menu Item directive.
 */
@Directive({
  selector: '[uiMenuItem]',
})
export class MenuItemDirective {
  /** Classes */
  private classes = [
    'flex',
    'flex-row',
    'gap-4',
    'py-2',
    'px-3',
    'text-gray-700',
    'hover:text-gray-900',
    'cursor-pointer',
    'hover:bg-gray-50',
  ] as const;

  /**
   * UI Menu item directive
   *
   * @param renderer Angular renderer
   * @param el Angular Element Ref
   */
  constructor(private renderer: Renderer2, el: ElementRef) {
    this.classes.forEach((className: string) => {
      this.renderer.addClass(el.nativeElement, className);
    });
  }
}
