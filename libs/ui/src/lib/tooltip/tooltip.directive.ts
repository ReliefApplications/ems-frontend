import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective {
  @Input() toolTipHint = 'test';

  elToolTip: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.elToolTip) {
      this.showHint();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.elToolTip) {
      this.removeHint();
    }
  }

  removeHint() {
    this.renderer.removeClass(
      this.elToolTip,
      'bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute'
    );
    this.renderer.removeChild(document.body, this.elToolTip);
    this.elToolTip = null;
  }

  showHint() {
    this.elToolTip = this.renderer.createElement('span');
    const text = this.renderer.createText(this.toolTipHint);
    this.renderer.appendChild(this.elToolTip, text);

    this.renderer.appendChild(document.body, this.elToolTip);
    this.renderer.addClass(
      this.elToolTip,
      'bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute'
    );

    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    // const tooltipPos = this.elToolTip.getBoundingClientRect();

    const top = hostPos.bottom + 10;
    const left = hostPos.left;

    this.renderer.setStyle(this.elToolTip, 'top', `${top}px`);
    this.renderer.setStyle(this.elToolTip, 'left', `${left}px`);
  }
}
