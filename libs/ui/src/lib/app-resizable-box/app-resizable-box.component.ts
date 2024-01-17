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
    this.elementRef.nativeElement.classList.add('noselect');
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
    if (
      this.direction === 'left' ||
      this.direction === 'top-left' ||
      this.direction === 'bottom-left'
    ) {
      const newWidth = this.width + (this.lastX - event.clientX);
      this.elementRef.nativeElement.style.width = `${newWidth}px`;
    } else if (
      this.direction === 'right' ||
      this.direction === 'top-right' ||
      this.direction === 'bottom-right'
    ) {
      const newWidth = this.width + (event.clientX - this.lastX);
      this.elementRef.nativeElement.style.width = `${newWidth}px`;
    }
    if (
      this.direction === 'top' ||
      this.direction === 'top-left' ||
      this.direction === 'top-right'
    ) {
      const newHeight = this.height + (this.lastY - event.clientY);
      this.elementRef.nativeElement.style.height = `${newHeight}px`;
    } else if (
      this.direction === 'bottom' ||
      this.direction === 'bottom-left' ||
      this.direction === 'bottom-right'
    ) {
      const newHeight = this.height + (event.clientY - this.lastY);
      this.elementRef.nativeElement.style.height = `${newHeight}px`;
    }
  }

  /**
   * Stop the process of resizing
   */
  resizeEnd(): void {
    this.resizing = false;
    this.elementRef.nativeElement.classList.remove('noselect');
  }
}
