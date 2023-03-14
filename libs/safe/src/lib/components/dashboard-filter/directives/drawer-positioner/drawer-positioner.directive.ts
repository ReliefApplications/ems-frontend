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
 * Directive to place element in the parent elements sides
 */
@Directive({
  selector: '[safeDrawerPositioner]',
})
export class SafeDrawerPositionerDirective
  implements OnChanges, AfterContentInit
{
  @Input() position: FilterPosition = FilterPosition.TOP;
  @Input() elementWidth!: string;
  @Input() elementHeight!: string;
  @Input() minSizeOnClosed = 48;
  @Input() opened = false;

  /**
   * Class constructor
   *
   * @param el Element attached to directive
   * @param renderer Renderer
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.position?.currentValue) {
      this.setPosition(changes.position.currentValue);
    }
    if (changes.opened) {
      this.displayDrawer(changes.opened?.currentValue);
    }
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

  ngAfterContentInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'z-index', 10);
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform ease-in-out .3s'
    );
    this.setPosition(this.position);
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
    this.renderer.removeStyle(this.el.nativeElement, 'right');
    this.renderer.removeStyle(this.el.nativeElement, 'bottom');
    switch (position) {
      case FilterPosition.TOP:
        this.renderer.removeStyle(this.el.nativeElement, 'width');
        this.renderer.setStyle(
          this.el.nativeElement,
          'width',
          this.elementWidth
        );
        break;

      case FilterPosition.BOTTOM:
        this.renderer.removeStyle(this.el.nativeElement, 'width');
        this.renderer.setStyle(this.el.nativeElement, 'bottom', 0);
        this.renderer.setStyle(
          this.el.nativeElement,
          'width',
          this.elementWidth
        );
        break;

      case FilterPosition.LEFT:
        this.renderer.removeStyle(this.el.nativeElement, 'height');
        this.renderer.setStyle(
          this.el.nativeElement,
          'height',
          this.elementHeight
        );
        break;

      case FilterPosition.RIGHT:
        this.renderer.removeStyle(this.el.nativeElement, 'height');
        this.renderer.setStyle(this.el.nativeElement, 'right', 0);
        this.renderer.setStyle(
          this.el.nativeElement,
          'height',
          this.elementHeight
        );
        break;
      default:
        break;
    }
    this.displayDrawer(this.opened);
  }

  /**
   * Display the drawer with the needed styling
   *
   * @param open open
   */
  private displayDrawer(open: boolean) {
    switch (this.position) {
      case FilterPosition.TOP:
        if (open) {
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
        }
        break;
      case FilterPosition.BOTTOM:
        if (open) {
          this.el.nativeElement.style.transform = `translateY(0px)`;
        } else {
          this.el.nativeElement.style.transform = `translateY(${Math.abs(
            this.minSizeOnClosed - this.el.nativeElement.clientHeight
          )}px)`;
        }
        break;
      case FilterPosition.LEFT:
        if (open) {
          this.el.nativeElement.style.transform = `translateX(0px)`;
        } else {
          this.el.nativeElement.style.transform = `translateX(${
            this.minSizeOnClosed - this.el.nativeElement.clientWidth
          }px)`;
        }
        break;
      case FilterPosition.RIGHT:
        if (open) {
          this.el.nativeElement.style.transform = `translateX(0px)`;
        } else {
          this.el.nativeElement.style.transform = `translateX(${Math.abs(
            this.minSizeOnClosed - this.el.nativeElement.clientWidth
          )}px)`;
        }
        break;
      default:
        break;
    }
  }
}
