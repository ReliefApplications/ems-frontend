import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import get from 'lodash/get';

/**
 * Fullscreen directive.
 * Allow components to take full size of the screen.
 */
@Directive({
  selector: '[sharedFullScreen]',
})
export class FullScreenDirective
  implements OnChanges, OnDestroy, AfterViewInit
{
  // Banana box binding properties to trigger full screen on the attached element
  /** Input decorator for full screen mode */
  @Input() isFullScreenMode!: boolean;
  /** Output decorator for full screen mode */
  @Output() isFullScreenModeChange = new EventEmitter<boolean>();
  // How nested is the element(parentElement) respect the directive's attached element that we want to set to fullscreen mode
  /** Input decorator for parent element nested number */
  @Input() parentElementNestedNumber = 2;
  /** Accessor to the nested property of the element */
  private accessorString = '';
  /** Full screen listener */
  private fullScreenListener!: any;

  /**
   * Create the accessor to the path of the property for the fullscreen mode
   *
   * On fullscreen events, checks if user exited fullscreen mode
   * without using the button and reset settings.
   *
   * @param el Element bind to the directive
   * @param document Document token of the DOM
   * @param renderer Renderer2
   */
  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.accessorString = this.setAccessorPath();
    if (this.fullScreenListener) {
      this.fullScreenListener();
    }
    this.fullScreenListener = this.renderer.listen(
      this.document,
      'fullscreenchange',
      () => {
        if (!this.document.fullscreenElement) {
          this.isFullScreenModeChange.emit(false);
        }
      }
    );
  }

  ngAfterViewInit(): void {
    // Full screen mode default background(agent client stylesheet sets to black)
    this.renderer.setStyle(
      get(this.el.nativeElement, this.accessorString),
      'background',
      'inherit'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isFullScreenMode) {
      this.triggerFullScreenMode(changes.isFullScreenMode.currentValue);
    }
  }

  /**
   * Given the deepness value of the nested property, creates the accessor to the nested property
   *
   * @returns Path to the element
   */
  private setAccessorPath(): string {
    const numberOfDeepAccessArray = new Array<any>(
      this.parentElementNestedNumber
    );
    let accessorPath = '';
    for (let index = 0; index < numberOfDeepAccessArray.length; index++) {
      accessorPath =
        accessorPath +
        'parentElement' +
        (index !== numberOfDeepAccessArray.length - 1 ? '.' : '');
    }
    return accessorPath;
  }

  /**
   * Trigger the full screen mode of the element
   *
   * @param isFullScreenMode trigger full screen mode
   */
  private triggerFullScreenMode(isFullScreenMode: boolean) {
    if (isFullScreenMode) {
      get(this.el.nativeElement, this.accessorString)?.requestFullscreen();
    } else {
      if (this.document.fullscreenElement) {
        this.document.exitFullscreen();
      }
    }
  }

  ngOnDestroy(): void {
    get(this.el.nativeElement, this.accessorString) &&
      this.renderer.removeStyle(
        get(this.el.nativeElement, this.accessorString),
        'background'
      );
    if (this.fullScreenListener) {
      this.fullScreenListener();
    }
  }
}
