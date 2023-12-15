import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Renderer2,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  Inject,
} from '@angular/core';
import { SidenavPositionTypes, SidenavTypes } from './types/sidenavs';
import { DOCUMENT } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';

/**
 * UI Sidenav directive.
 * The sidenav appears in a cdk overlay when fullscreen is triggered.
 */
@Directive({
  selector: '[uiSidenavDirective]',
  exportAs: 'uiSidenavDirective',
})
export class SidenavDirective implements OnInit, OnDestroy, OnChanges {
  /** Whether the sidenav is opened */
  @Input() opened = true;
  /** Whether the sidenav is to be kept on fullscreen */
  @Input() keepFullscreen = false;
  /** Whether the sidenav is visible */
  @Input() visible = true;
  /** Sidenav mode */
  @Input() mode: SidenavTypes = 'side';
  /** Sidenav position */
  @Input() position: SidenavPositionTypes = 'start';
  /** Event emitter for opened change */
  @Output() openedChange = new EventEmitter<boolean>();
  /** Timeout to toggle */
  private toggleTimeoutListener!: NodeJS.Timeout;

  /** Click outside listener */
  private clickOutsideListener!: () => void;
  /** Fullscreen listener */
  private fullscreenListener!: () => void;
  /** Expand change event listener */
  private expandChangeListener!: () => void;
  /** Whether the toggle was used */
  private toggleUsed = false;

  /** Overlay reference */
  private overlayRef?: OverlayRef;
  /** Dom portal */
  private portal?: DomPortal;

  /**
   * UI Sidenav directive constructor
   *
   * @param el host element
   * @param renderer Renderer2
   * @param document Document
   * @param overlay CDK Overlay
   */
  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private overlay: Overlay
  ) {}

  ngOnInit(): void {
    // Subscribe to click events
    this.clickOutsideListener = this.renderer.listen(
      this.document,
      'click',
      (event) => {
        if (
          !this.toggleUsed &&
          this.opened &&
          !this.el.nativeElement.contains(event.target) &&
          this.mode === 'over'
        ) {
          this.opened = false;
          this.openedChange.emit(this.opened);
        }
      }
    );
    if (this.keepFullscreen) {
      // Subscribe to fullscreen events
      this.fullscreenListener = this.renderer.listen(
        this.document,
        'fullscreenchange',
        () => {
          if (this.document.fullscreenElement) {
            this.createOverlay();
          } else {
            this.closeOverlay();
          }
        }
      );
      // Subscribe to widget expanded events
      this.expandChangeListener = this.renderer.listen(
        this.document,
        'expandchange',
        (event) => {
          if (event.detail.expanded) {
            this.createOverlay();
          } else {
            this.closeOverlay();
          }
        }
      );
    }
  }

  ngOnChanges(change: SimpleChanges) {
    this.opened = change['opened']?.currentValue ?? false;
    if (this.overlayRef) {
      if (this.opened) {
        this.overlayRef.updateSize({ width: this.portal?.element.offsetWidth });
        this.overlayRef.updatePosition();
      } else {
        this.overlayRef.updateSize({ width: 0 });
      }
    }
    this.openedChange.emit(this.opened);
  }

  /**
   * Create overlay where the sidenav will display in
   * Dom Portal would get html from the sidenav content, and pass it to the overlay
   */
  private createOverlay() {
    this.overlayRef = this.overlay.create({
      panelClass: ['bg-white', 'shadow-2lg', 'overflow-y-auto'],
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.document.body)
        .withFlexibleDimensions(true)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
        ])
        .withGrowAfterOpen(),
      minHeight: '100vh',
    });
    this.renderer.addClass(this.el.nativeElement, 'h-screen');
    this.portal = new DomPortal(this.el.nativeElement);
    this.overlayRef.attach(this.portal);
    if (this.opened) {
      this.overlayRef.updateSize({
        width: this.portal?.element.offsetWidth,
      });
      this.overlayRef.updatePosition();
    }
  }

  /**
   * Destroy the overlay ref
   * The dom portal content will go back to original position (inside sidebar)
   */
  private closeOverlay() {
    this.overlayRef?.dispose();
    if (this.opened) {
      this.renderer.removeClass(this.el.nativeElement, 'h-screen');
    }
  }

  /** Handles the toggle of the sidenav status */
  public toggle() {
    this.toggleUsed = true;
    if (this.toggleTimeoutListener) {
      clearTimeout(this.toggleTimeoutListener);
    }
    this.toggleTimeoutListener = setTimeout(() => {
      this.opened = !this.opened;
      this.openedChange.emit(this.opened);
      this.toggleUsed = false;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.toggleTimeoutListener) {
      clearTimeout(this.toggleTimeoutListener);
    }
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    if (this.fullscreenListener) {
      this.fullscreenListener();
    }
    if (this.expandChangeListener) {
      this.expandChangeListener();
    }
  }
}
