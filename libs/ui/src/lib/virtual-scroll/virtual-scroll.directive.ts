import {
  AfterViewInit,
  Attribute,
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[uiVirtualScroll]',
  standalone: true,
})
export class VirtualScrollDirective implements AfterViewInit {
  private currentElementHeight = 0;
  private currentItemSize = 50;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private el: ElementRef,
    @Attribute('itemSize') itemSize: string
  ) {
    this.currentItemSize = Number(itemSize);
    this.vcr.createEmbeddedView(this.tpl);
  }

  ngAfterViewInit(): void {
    this.currentElementHeight = this.el.nativeElement.height;
  }
}
