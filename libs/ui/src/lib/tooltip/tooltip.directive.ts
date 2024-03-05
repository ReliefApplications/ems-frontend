import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
  Inject,
  OnInit,
  Attribute,
  ComponentRef,
} from '@angular/core';
import { TooltipEnableBy } from './types/tooltip-enable-by-list';
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TooltipComponent } from './tooltip.component';
import { ComponentPortal } from '@angular/cdk/portal';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Directive that allows to display a tooltip on a given html element
 */
@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  /** Tooltip text */
  @Input() uiTooltip = '';
  /** Is tooltip disabled */
  @Input() tooltipDisabled = false;
  /** Overlay reference */
  private overlayRef!: OverlayRef;

  /**
   * Tooltip directive.
   *
   * @param document current DOCUMENT
   * @param {TooltipEnableBy} enableBy special cases that enable/disable tooltip display
   * @param elementRef Tooltip host reference
   * @param overlay Overlay
   * @param overlayPositionBuilder cdk overlay position builder
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Attribute('tooltipEnableBy') public enableBy: TooltipEnableBy,
    public elementRef: ElementRef,
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {
    if (!enableBy) {
      this.enableBy = 'default';
    }
  }

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ]);
    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  /**
   * Function that listen for the user's mouse to enter the element where the directive is placed
   */
  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.enableBy !== 'default') {
      this.tooltipDisabled = this.disableTooltipByCase();
    }
    if (this.uiTooltip && !this.tooltipDisabled) {
      // Create tooltip portal
      const tooltipPortal = new ComponentPortal(TooltipComponent);
      // Attach tooltip portal to overlay
      const tooltipRef: ComponentRef<TooltipComponent> =
        this.overlayRef.attach(tooltipPortal);
      // Pass content to tooltip component instance
      tooltipRef.instance.uiTooltip = this.uiTooltip;
    }
  }

  /**
   * Function that listen for the user's mouse to quit the element where the directive is placed
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeHint();
  }

  /**
   * Destroy the tooltip and stop its display
   */
  private removeHint() {
    this.overlayRef.detach();
  }

  /**
   * Update tooltip disable status by the given cases
   *
   * @returns disable state of the tooltip
   */
  private disableTooltipByCase(): boolean {
    let isDisabled = this.tooltipDisabled;
    switch (this.enableBy) {
      case 'truncate':
        isDisabled = !(
          this.elementRef.nativeElement.offsetWidth <
          this.elementRef.nativeElement.scrollWidth
        );
        break;
      default:
        break;
    }
    return isDisabled;
  }

  /**
   * If the element is gone but we don't move cursor out,
   * remove the tooltip by default
   */
  ngOnDestroy(): void {
    this.removeHint();
  }
}

/**
 * Directive that allows selecting the preferred position of the tooltip
 */
@Directive({
  selector: '[uiTooltipPosition]',
})
export class TooltipPositionDirective implements OnInit {
  /** Tooltip position */
  @Input('uiTooltipPosition') position: TooltipPosition = 'bottom';

  /**
   * Directive that allows selecting the preferred position of the tooltip
   *
   * @param elementRef Tooltip host reference
   */
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const tooltipElement = this.elementRef.nativeElement;
    if (tooltipElement) {
      // Add data attribute to the host element
      tooltipElement.dataset.tooltipPosition = this.position;
    }
  }
}
