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
  ConnectedPosition,
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
  /** preferred position for the tooltip */
  @Input() preferredPosition: TooltipPosition = 'bottom';
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

  /**
   * transforms a tooltip position into a connected position
   *
   * @param position the tooltip position as a string
   * @returns the connected position
   */
  private getDefaultPosition(position: TooltipPosition): ConnectedPosition {
    switch (position) {
      case 'bottom':
        return {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        };
      case 'top':
        return {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        };
      case 'right':
        return {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
        };
      case 'left':
        return {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
        };
    }
  }

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        this.getDefaultPosition(this.preferredPosition),
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
