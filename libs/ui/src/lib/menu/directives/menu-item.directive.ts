import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[uiMenuItem]',
})
export class MenuItemDirective {
  constructor(private renderer: Renderer2, el: ElementRef) {
    const classes =
      'flex flex-row gap-4 py-2 px-3 cursor-pointer hover:bg-gray-50';
    classes.split(' ').forEach((className: string) => {
      this.renderer.addClass(el.nativeElement, className);
    });
  }
}
