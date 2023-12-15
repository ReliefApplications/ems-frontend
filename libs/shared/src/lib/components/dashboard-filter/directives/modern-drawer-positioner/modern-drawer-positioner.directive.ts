import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

/**
 * Drawer positioner directive for modern variant of dashboard filter.
 */
@Directive({
  selector: '[modernDrawerPositioner]',
})
export class ModernDrawerPositionerDirective implements OnChanges {
  /** Width of drawer */
  @Input() elementWidth!: string;
  /** Is element visible or not */
  @Input() visible = true;

  /**
   * Drawer positioner directive for modern variant of dashboard filter.
   *
   * @param el current html element
   * @param renderer Angular renderer
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    this.setPosition();
  }

  /**
   * Set drawer position based on width.
   */
  private setPosition() {
    this.renderer.setStyle(this.el.nativeElement, 'width', this.elementWidth);
    this.renderer.setStyle(this.el.nativeElement, 'margin-top', '-32px');
    this.renderer.setStyle(this.el.nativeElement, 'margin-left', '-24px');
    this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', '12px');
    if (this.visible) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}
