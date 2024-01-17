import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

/**
 * Resizable box component.
 * Resizable box are UI that provide the possibility to resize an element.
 */
@Component({
  selector: 'ui-app-resizable-box',
  templateUrl: './app-resizable-box.component.html',
  styleUrls: ['./app-resizable-box.component.scss'],
})
export class AppResizableBoxComponent implements OnInit, OnDestroy {
  /** control if the resize is enable*/
  @Input() enable = true;
  /** boolean to indicate if it's inside dialog */
  @Input() dialog = false;
  /** is resizing  */
  private resizing = false;
  /** last value of x */
  private lastX = 0;
  /** last value of y*/
  private lastY = 0;
  /** width of the element*/
  private width = 0;
  /** height of the element */
  private height = 0;
  /** direction of the resize */
  private direction = '';
  /**  Mouse move subscription*/
  private mouseMoveSubscription?: Subscription;
  /** Mouse up subscription */
  private mouseUpSubscription?: Subscription;
  /** minimum width */
  private minWidth = 0;
  /** minimum height */
  private minHeight = 0;

  /**
   * Constructor for the resizable box component
   *
   * @param elementRef element reference
   */
  constructor(private elementRef: ElementRef) {}

  /**
   * Resizing state
   *
   * @param event The mouse event
   */

  ngOnInit() {
    if (this.enable) {
      this.elementRef.nativeElement.addEventListener(
        'mousedown',
        this.resizeStart.bind(this)
      );
      this.mouseMoveSubscription = fromEvent<MouseEvent>(
        document,
        'mousemove'
      ).subscribe(this.resizeMove.bind(this));
      this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(
        this.resizeEnd.bind(this)
      );
    }
  }

  ngOnDestroy() {
    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.unsubscribe();
    }
    if (this.mouseUpSubscription) {
      this.mouseUpSubscription.unsubscribe();
    }
  }

  /**
   * Start the process of resizing
   *
   * @param event The mouse event
   */
  resizeStart(event: MouseEvent): void {
    this.resizing = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.width = this.elementRef.nativeElement.clientWidth;
    this.height = this.elementRef.nativeElement.clientHeight;
    this.elementRef.nativeElement.classList.add('no-select');
    // set min height and width based on current size
    this.minHeight = this.elementRef.nativeElement.offsetHeight;
    this.minWidth = this.elementRef.nativeElement.offsetWidth;
  }

  /**
   * Set the direction of the resize
   *
   * @param direction The direction of the resize
   */
  setDirection(direction: string): void {
    this.direction = direction;
  }

  /**
   * Resize the element
   *
   * @param event The mouse event
   */
  resizeMove(event: MouseEvent): void {
    if (!this.resizing) return;
    event.stopPropagation();
    event.preventDefault();
    const dashboardNavbar =
      document.documentElement.getElementsByTagName('shared-navbar');
    let dashboardNavbarWidth = 0;
    if (dashboardNavbar[0] && !this.dialog) {
      dashboardNavbarWidth = (dashboardNavbar[0] as any).offsetWidth;
    }
    // set the max width as 80% of the screen size
    const maxWidth = Math.max(
      Math.round(
        (document.documentElement.clientWidth - dashboardNavbarWidth) * 0.8
      ),
      this.minWidth
    );
    // set the max height as 80% of the screen size
    const maxHeight = Math.max(
      Math.round(document.documentElement.clientHeight * 0.8),
      this.minHeight
    );
    let newWidth: number;
    let newHeight: number;
    if (
      this.direction === 'left' ||
      this.direction === 'top-left' ||
      this.direction === 'bottom-left'
    ) {
      newWidth = this.width + (this.lastX - event.clientX);
      newWidth = Math.max(this.minWidth, Math.min(newWidth, maxWidth));
      this.elementRef.nativeElement.style.width = `${newWidth}px`;
    } else if (
      this.direction === 'right' ||
      this.direction === 'top-right' ||
      this.direction === 'bottom-right'
    ) {
      newWidth = this.width + (event.clientX - this.lastX);
      newWidth = Math.max(this.minWidth, Math.min(newWidth, maxWidth));
      this.elementRef.nativeElement.style.width = `${newWidth}px`;
    }
    if (
      this.direction === 'top' ||
      this.direction === 'top-left' ||
      this.direction === 'top-right'
    ) {
      newHeight = this.height + (this.lastY - event.clientY);
      newHeight = Math.max(this.minHeight, Math.min(newHeight, maxHeight));
      this.elementRef.nativeElement.style.height = `${newHeight}px`;
    } else if (
      this.direction === 'bottom' ||
      this.direction === 'bottom-left' ||
      this.direction === 'bottom-right'
    ) {
      newHeight = this.height + (event.clientY - this.lastY);
      newHeight = Math.max(this.minHeight, Math.min(newHeight, maxHeight));
      this.elementRef.nativeElement.style.height = `${newHeight}px`;
    }
  }

  /**
   * Stop the process of resizing
   */
  resizeEnd(): void {
    this.resizing = false;
    this.elementRef.nativeElement.classList.remove('no-select');
  }
}
