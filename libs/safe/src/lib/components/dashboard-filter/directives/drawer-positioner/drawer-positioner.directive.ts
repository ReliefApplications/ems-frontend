import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { FilterPosition } from '../../enums/dashboard-filters.enum';

/**
 * Directive to place directive's host in the parent elements sides as a fixed element
 */
@Directive({
  selector: '[safeDrawerPositioner]',
})
export class SafeDrawerPositionerDirective
  implements OnChanges, AfterContentInit
{
  // Where is the element going to be positioned
  @Input() position: FilterPosition = FilterPosition.TOP;
  // The element width, as the directive host is positioned fixed, we need to set the width manually in order to match the parent element
  @Input() elementWidth!: string;
  // The element height, as the directive host is positioned fixed, we need to set the height manually in order to match the parent element
  @Input() elementHeight!: string;
  @Input() elementLeftOffset!: string;
  @Input() elementTopOffset!: string;
  // The minimum amount of element size(in px) remaining visible when the element is collapsed
  @Input() minSizeOnClosed = 48;
  // If the element is open or not
  @Input() opened = false;
  @Input()
  dashboardSurveyCreatorContainer!: any;

  /**
   * Class constructor
   *
   * @param el Element attached to directive
   * @param renderer Renderer to add/remove styles and classes on the fly to the directive's host element
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  /**
   * After the element is initialize in the DOM view, we set the default styles and classes that it needs to work properly
   * The element is fixed to work with scroll, it has a superior z-index than the parent context, and would have a smooth transition for the open/close feature
   *
   * After all is set, we update the element position with the given one
   */
  ngAfterContentInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'fixed');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', 10);
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform ease-in-out .3s'
    );
    this.setPosition(this.position);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.position ||
      changes.elementLeftOffset ||
      changes.elementTopOffset ||
      changes.elementWidth ||
      changes.elementHeight
    ) {
      this.setPosition(this.position);
    }
    if (changes.opened?.currentValue !== changes.opened?.previousValue) {
      this.displayDrawer(changes.opened.currentValue);
    }
  }

  /**
   * Set the element position related to the parent component
   *
   * @param position Position to set
   */
  private setPosition(position: FilterPosition) {
    // Reset drawer containers styles
    this.renderer.setStyle(this.el.nativeElement, 'height', 'max-content');
    this.renderer.setStyle(this.el.nativeElement, 'width', 'max-content');
    this.renderer.setStyle(
      this.dashboardSurveyCreatorContainer,
      'height',
      this.elementHeight
    );
    // Remove any positioning from the element first in order to not conflict with each position properties later
    this.renderer.removeStyle(this.el.nativeElement, 'right');
    this.renderer.removeStyle(this.el.nativeElement, 'bottom');
    this.renderer.removeStyle(this.el.nativeElement, 'top');
    this.renderer.removeStyle(this.el.nativeElement, 'left');
    this.renderer.removeStyle(
      this.dashboardSurveyCreatorContainer,
      'max-height'
    );
    switch (position) {
      // Set the width as it's in the horizontal side of the parent context, fixed element is in the top of parent context by default
      case FilterPosition.TOP:
        this.renderer.setStyle(
          this.el.nativeElement,
          'top',
          this.elementTopOffset
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'left',
          this.elementLeftOffset
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'width',
          this.elementWidth
        );
        this.renderer.setStyle(
          this.dashboardSurveyCreatorContainer,
          'max-height',
          `${Number(this.elementHeight.split('px')[0]) / 3}px`
        ); // The filter cannot take more than a third of the screen in height
        break;
      // Set the width as it's in the horizontal side of the parent context, but also set the bottom property to 0
      case FilterPosition.BOTTOM:
        this.renderer.setStyle(this.el.nativeElement, 'bottom', 0);
        this.renderer.setStyle(
          this.el.nativeElement,
          'left',
          this.elementLeftOffset
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'width',
          this.elementWidth
        );
        this.renderer.setStyle(
          this.dashboardSurveyCreatorContainer,
          'max-height',
          `${Number(this.elementHeight.split('px')[0]) / 3}px`
        ); // The filter cannot take more than a third of the screen in height
        break;
      // Set the height as it's in the vertical side of the parent context, fixed element is in the left of parent context by default
      case FilterPosition.LEFT:
        this.renderer.setStyle(
          this.el.nativeElement,
          'height',
          this.elementHeight
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'left',
          this.elementLeftOffset
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'top',
          this.elementTopOffset
        );
        break;
      // Set the height as it's in the vertical side of the parent context, but also set the right property to 0
      case FilterPosition.RIGHT:
        this.renderer.setStyle(this.el.nativeElement, 'right', 0);
        this.renderer.setStyle(
          this.el.nativeElement,
          'height',
          this.elementHeight
        );
        this.renderer.setStyle(
          this.el.nativeElement,
          'top',
          this.elementTopOffset
        );
        break;
      default:
        break;
    }
    setTimeout(() => this.displayDrawer(this.opened), 0); //Waiting to acquire the right client size
  }

  /**
   * Display the drawer with the needed styling
   *
   * @param open open
   */
  private displayDrawer(open: boolean) {
    switch (this.position) {
      case FilterPosition.TOP:
        this.translateY(open);
        break;
      case FilterPosition.BOTTOM:
        this.translateY(open, true);
        break;
      case FilterPosition.LEFT:
        this.translateX(open);
        break;
      case FilterPosition.RIGHT:
        this.translateX(open, true);
        break;
      default:
        break;
    }
  }

  /**
   * Open animation for Y axis
   *
   * @param open Is element open
   * @param translateToTheBottom Has to use absolute value(for BOTTOM)
   */
  private translateY(open: boolean, translateToTheBottom: boolean = false) {
    if (open) {
      this.el.nativeElement.style.transform = `translateY(0)`;
    } else {
      // If close we would translate the element out leaving the minSizeOnClosed value visible
      const heightToTranslate =
        this.minSizeOnClosed - this.el.nativeElement.clientHeight;
      this.el.nativeElement.style.transform = `translateY(${
        translateToTheBottom ? -heightToTranslate : heightToTranslate
      }px)`;
    }
  }

  /**
   * Open animation for X axis
   *
   * @param open Is element open
   * @param translateToTheRight Has to use absolute value(for RIGHT)
   */
  private translateX(open: boolean, translateToTheRight: boolean = false) {
    if (open) {
      this.el.nativeElement.style.transform = `translateX(0px)`;
    } else {
      // If close we would translate the element out leaving the minSizeOnClosed value visible
      const widthToTranslate =
        this.minSizeOnClosed - this.el.nativeElement.clientWidth;
      this.el.nativeElement.style.transform = `translateX(${
        translateToTheRight ? -widthToTranslate : widthToTranslate
      }px)`;
    }
  }
}
