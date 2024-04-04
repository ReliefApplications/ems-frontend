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
    if (this.currentHost.contains(this.elToolTip)) {
      this.renderer.removeChild(this.currentHost, this.elToolTip);
    }
  }

  /**
   * Show the tooltip and place it on the screen accordingly to its width and height
   */
  private showHint() {
    // Fullscreen only renders the current full-screened element,
    // Therefor we check if exists to take it as a reference, else we use the document body by default
    const elementRef = this.document.fullscreenElement ?? this.currentHost;
    this.elToolTip.textContent = this.uiTooltip;
    this.renderer.addClass(this.elToolTip, 'opacity-0');
    this.renderer.appendChild(elementRef, this.elToolTip);
    // Management of tooltip placement in the screen (including screen edges cases)
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.elToolTip.getBoundingClientRect();
    this.renderer.removeClass(this.elToolTip, 'opacity-0');
    this.renderer.removeChild(elementRef, this.elToolTip);

    let top = 0;
    let left = 0;
    const tooltipWidth = tooltipPos.width;
    const tooltipHeight = tooltipPos.height;

    // Gets the preferred position from the data attribute
    // set by the TooltipPositionDirective
    this.position =
      this.elementRef.nativeElement.dataset.tooltipPosition ?? 'bottom';

    switch (this.position) {
      case 'top': {
        top = hostPos.top - tooltipHeight - this.tooltipSeparation;
        left = hostPos.left + hostPos.width / 2 - tooltipWidth / 2;
        break;
      }
      case 'bottom': {
        top = hostPos.bottom + this.tooltipSeparation;
        left = hostPos.left + hostPos.width / 2 - tooltipWidth / 2;
        break;
      }
      case 'left': {
        top = hostPos.top + hostPos.height / 2 - tooltipHeight / 2;
        left = hostPos.left - tooltipWidth - this.tooltipSeparation;
        break;
      }
      case 'right': {
        top = hostPos.top + hostPos.height / 2 - tooltipHeight / 2;
        left = hostPos.right + this.tooltipSeparation;
        break;
      }
    }

    // Clamp the tooltip position to the screen edges
    top = Math.max(0, Math.min(top, window.innerHeight - tooltipHeight));
    left = Math.max(0, Math.min(left, window.innerWidth - tooltipWidth));

    this.renderer.setStyle(this.elToolTip, 'top', `${top}px`);
    this.renderer.setStyle(this.elToolTip, 'left', `${left}px`);
    this.renderer.appendChild(elementRef, this.elToolTip);
  }

  /**
   * Creates an span HTML element with the tooltip properties
   */
  private createTooltipElement(): void {
    this.elToolTip = this.renderer.createElement('span');
    for (const cl of this.tooltipClasses) {
      this.renderer.addClass(this.elToolTip, cl);
    }
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
