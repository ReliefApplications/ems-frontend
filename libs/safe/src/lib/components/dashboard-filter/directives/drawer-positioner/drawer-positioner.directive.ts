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
    console.log(this.el.nativeElement.style);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.position?.currentValue) {
      this.setPosition(changes.position.currentValue);
    }
    if (changes.opened) {
      //this.displayDrawer(changes.opened.currentValue); disabled for now as it messes things up
    }
    // Width has to be set when the element is in horizontal(at the TOP or BOTTOM of the parent context) position
    if (
      changes.elementWidth?.currentValue &&
      (this.position === FilterPosition.TOP ||
        this.position === FilterPosition.BOTTOM)
    ) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'width',
        changes.elementWidth.currentValue
      );
    }
    // Height has to be set when the element is in vertical(at the LEFT or RIGHT of the parent context) position
    if (
      changes.elementHeight?.currentValue &&
      (this.position === FilterPosition.LEFT ||
        this.position === FilterPosition.RIGHT)
    ) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'height',
        changes.elementHeight.currentValue
      );
    }
  }

  /**
   * Set the element position related to the parent component
   *
   * @param position Position to set
   */
  private setPosition(position: FilterPosition) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    // Reset drawer containers styles
    this.renderer.setStyle(this.el.nativeElement, 'height', 'max-content');
    this.renderer.setStyle(this.el.nativeElement, 'width', 'max-content');
    // Remove any positioning from the element first in order to not conflict with each position properties later
    this.renderer.removeStyle(this.el.nativeElement, 'right');
    this.renderer.removeStyle(this.el.nativeElement, 'bottom');
    this.renderer.removeStyle(this.el.nativeElement, 'top');
    this.renderer.removeStyle(this.el.nativeElement, 'left');
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
          this.el.nativeElement,
          'max-height',
          this.elementHeight
        );
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
          this.el.nativeElement,
          'max-height',
          this.elementHeight
        );
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
    //this.displayDrawer(this.opened);  disabled for now as it messes things up
  }

  /**
   * Display the drawer with the needed styling
   *
   * @param open open
   */
  private displayDrawer(open: boolean) {
    switch (this.position) {
      case FilterPosition.TOP:
        // TOP has an especial behavior as the overflow for the top side of the parent if is not in the viewport, it would be visible
        // We will have to set the parent element as the container reference(e.g. setting transform property, but the positioned element would lose fixed behavior)
        /*if (open) {
          this.el.nativeElement.style.transform = `translateY(0px)`;
          setTimeout(() => {
            this.renderer.setStyle(
              document
                .getElementsByClassName('dashboard-filter-content')
                .item(0),
              'visibility',
              'initial'
            );
          }, 200);
        } else {
          // If close we would translate the element out leaving the minSizeOnClosed value visible
          this.el.nativeElement.style.transform = `translateY(${
            this.minSizeOnClosed - this.el.nativeElement.clientHeight
          }px)`;
          setTimeout(() => {
            this.renderer.setStyle(
              document
                .getElementsByClassName('dashboard-filter-content')
                .item(0),
              'visibility',
              'collapse'
            );
          }, 50);
        }*/
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
   * @param isAbsoluteValue Has to use absolute value(for BOTTOM)
   */
  private translateY(open: boolean, isAbsoluteValue: boolean = false) {
    if (open) {
      this.el.nativeElement.style.transform = `translateY(0px)`;
    } else {
      // If close we would translate the element out leaving the minSizeOnClosed value visible
      this.el.nativeElement.style.transform = `translateY(${
        isAbsoluteValue
          ? Math.abs(this.minSizeOnClosed - this.el.nativeElement.clientHeight)
          : this.minSizeOnClosed - this.el.nativeElement.clientHeight
      }px)`;
      console.log(
        'translating by',
        this.el.nativeElement.clientHeight,
        this.el.nativeElement.clientWidth
      );
    }
  }

  /**
   * Open animation for X axis
   *
   * @param open Is element open
   * @param isAbsoluteValue Has to use absolute value(for RIGHT)
   */
  private translateX(open: boolean, isAbsoluteValue: boolean = false) {
    if (open) {
      this.el.nativeElement.style.transform = `translateX(0px)`;
    } else {
      // If close we would translate the element out leaving the minSizeOnClosed value visible
      this.el.nativeElement.style.transform = `translateX(${
        isAbsoluteValue
          ? Math.abs(this.minSizeOnClosed - this.el.nativeElement.clientWidth)
          : this.minSizeOnClosed - this.el.nativeElement.clientWidth
      }px)`;
      console.log(
        'translating by',
        this.el.nativeElement.clientHeight,
        this.el.nativeElement.clientWidth
      );
    }
  }
}
