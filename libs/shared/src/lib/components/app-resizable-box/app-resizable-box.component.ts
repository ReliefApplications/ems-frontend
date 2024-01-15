import { Component, ElementRef, HostListener } from '@angular/core';

/**
 *
 */
@Component({
  standalone: true,
  selector: 'shared-app-resizable-box',
  templateUrl: './app-resizable-box.component.html',
  styleUrls: ['./app-resizable-box.component.scss'],
})
export class AppResizableBoxComponent {
  /** is resizing  */
  private resizing = false;
  /** last value of x */
  private lastX = 0;
  /** last value of y*/
  private lastY = 0;
  /** width of */
  private width = 0;
  /**
   *
   */
  private height = 0;
  /**
   *
   */
  private direction = '';

  /**
   * Constructor
   *
   * @param elementRef element reference
   */
  constructor(private elementRef: ElementRef) {}

  /**
   * Resizing state
   *
   * @param event The mouse event
   * @param direction The direction of the resize
   */
  @HostListener('mousedown', ['$event'])
  resizeStart(event: MouseEvent, direction: string): void {
    this.resizing = true;
    this.direction = direction;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.width = this.elementRef.nativeElement.clientWidth;
    this.height = this.elementRef.nativeElement.clientHeight;
  }

  /**
   * Resizing state
   *
   * @param event The mouse event
   */
  @HostListener('document:mousemove', ['$event'])
  resizeMove(event: MouseEvent): void {
    if (!this.resizing) return;
    if (this.direction === 'left' || this.direction === 'right') {
      this.width -= event.clientX - this.lastX;
      this.lastX = event.clientX;
      this.elementRef.nativeElement.style.width = `${this.width}px`;
    }
    if (this.direction === 'top' || this.direction === 'bottom') {
      this.height -= event.clientY - this.lastY;
      this.lastY = event.clientY;
      this.elementRef.nativeElement.style.height = `${this.height}px`;
    }
  }

  /**
   * Resizing state
   */
  @HostListener('document:mouseup')
  resizeEnd(): void {
    this.resizing = false;
  }
}
