import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  OnDestroy,
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
import { TooltipPosition } from './types/tooltip-positions';

/**
 * Directive that allows to display a tooltip on a given html element
 */
@Directive({
  selector: '[uiTooltip]',
})
export class TooltipDirective implements OnDestroy {
  /** Tooltip text */
  @Input() uiTooltip = '';
  /** Tooltip title */
  @Input() uiTooltipTitle = '';
  /** Is tooltip disabled */
  @Input() tooltipDisabled = false;
  /** preferred position for the tooltip */
  @Input() uiTooltipPosition: TooltipPosition = 'bottom';
  /** Overlay reference */
  private overlayRef!: OverlayRef;

  /**
   * Tooltip directive.
   *
   * @param {TooltipEnableBy} enableBy special cases that enable/disable tooltip display
   * @param elementRef Tooltip host reference
   * @param overlay Overlay
   * @param overlayPositionBuilder cdk overlay position builder
   */
  constructor(
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

  /**
   * Create overlay ref where to attach tooltip
   */
  private createOverlay() {
    let defaultOffsetY = 5;
    // If element close to screen bottom, apply negative offset of the tooltip
    if (
      window.innerHeight -
        this.elementRef.nativeElement.getBoundingClientRect().bottom <
      30
    ) {
      defaultOffsetY = -5;
    }
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withDefaultOffsetY(defaultOffsetY)
      .withPositions([
        this.getDefaultPosition(this.uiTooltipPosition),
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
      this.createOverlay();
      // Create tooltip portal
      const tooltipPortal = new ComponentPortal(TooltipComponent);
      // Attach tooltip portal to overlay
      const tooltipRef: ComponentRef<TooltipComponent> =
        this.overlayRef.attach(tooltipPortal);
      // Pass content to tooltip component instance
      tooltipRef.instance.uiTooltip = this.uiTooltip;
      tooltipRef.instance.uiTooltipTitle = this.uiTooltipTitle;
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
   * Function that listen for the user's mouse down to quit the element where the directive is placed(drag and drop cases)
   */
  @HostListener('mousedown')
  onMouseDown() {
    this.removeHint();
  }

  /**
   * Destroy the tooltip and stop its display
   */
  private removeHint() {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
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
