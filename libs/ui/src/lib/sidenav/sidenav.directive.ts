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
  @Input() opened = true;
  @Input() keepFullscreen = false;
  @Input() visible = true;
  @Input() mode: SidenavTypes = 'side';
  @Input() position: SidenavPositionTypes = 'start';
  @Output() openedChange = new EventEmitter<boolean>();

  private clickOutsideListener!: () => void;
  private fullscreenListener!: () => void;
  private toggleUsed = false;

  private overlayRef?: OverlayRef;
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
      window,
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
      this.renderer.listen(this.document, 'expandchange', (event) => {
        if (event.detail.expanded) {
          this.createOverlay();
        } else {
          this.closeOverlay();
        }
      });
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
    setTimeout(() => {
      this.opened = !this.opened;
      this.openedChange.emit(this.opened);
      this.toggleUsed = false;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    if (this.fullscreenListener) {
      this.fullscreenListener();
    }
  }
}
