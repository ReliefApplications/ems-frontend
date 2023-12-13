import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription, merge } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { OverlayRef, Overlay, ConnectedPosition } from '@angular/cdk/overlay';

/**
 * UI Menu directive
 */
@Directive({
  selector: '[uiMenuTriggerFor]',
})
export class MenuTriggerForDirective {
  /** Menu trigger for */
  @Input('uiMenuTriggerFor') public menuPanel!: {
    templateRef: TemplateRef<any>;
    closed: EventEmitter<void>;
  };

  /** Whether the menu is open or not */
  private isMenuOpen = false;
  /** Overlay reference */
  overlayRef!: OverlayRef;
  /** Menu closing actions subscription */
  menuClosingActionsSubscription!: Subscription;

  /**
   * UI Directive constructor
   *
   * @param viewContainerRef ViewContainerRef
   * @param elementRef ElementRef
   * @param renderer Renderer2
   * @param overlay Overlay
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay
  ) {}

  /**
   * Host listener for the click event
   */
  @HostListener('click')
  toggleDropdown(): void {
    this.isMenuOpen ? this.destroyMenu() : this.openMenu();
  }

  /**
   * Set the overlay position origin taking in account the host element's position against screen boundaries
   *
   * @returns overlay positions array
   */
  private setOverlayOriginPosition(): ConnectedPosition[] {
    // As the menu is not displayed yet, we set a default value to check element boundaries
    const defaultCheckValue = 200;
    // Is the host element nearby the bottom edge of the screen
    const isBottomEdge =
      window.innerHeight -
        this.elementRef.nativeElement.getBoundingClientRect().top <
      defaultCheckValue;
    // Is the host element nearby the right edge of the screen
    const isRightEdge =
      window.innerWidth -
        this.elementRef.nativeElement.getBoundingClientRect().right <
      defaultCheckValue;
    return [
      {
        originX: isRightEdge ? 'end' : 'start',
        originY: isBottomEdge ? 'top' : 'bottom',
        overlayX: isRightEdge ? 'end' : 'start',
        overlayY: isBottomEdge ? 'bottom' : 'top',
        offsetX: 0,
        offsetY: 0,
      },
    ];
  }

  /**
   * Open the associated menu to the uiMenuTriggerDirective
   */
  openMenu(): void {
    this.isMenuOpen = true;
    const overlayOriginPosition = this.setOverlayOriginPosition();
    // We create an overlay for the displayed menu as done for Angular Material menu
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      // Set overlay class - would be transparent
      backdropClass: 'cdk-overlay-transparent-backdrop',
      // close menu on user scroll - default behavior, could be changed
      scrollStrategy: this.overlay.scrollStrategies.close(),
      // We position the displayed menu taking current directive host element as reference
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(overlayOriginPosition),
    });
    // Create the template portal for the menu items using the reference of the element given in the uiMenuTriggerFor input
    const templatePortal = new TemplatePortal(
      this.menuPanel.templateRef,
      this.viewContainerRef
    );
    // Attach it to our overlay
    this.overlayRef.attach(templatePortal);
    // We add the needed classes to create the animation on menu display
    setTimeout(() => {
      this.applyMenuDisplayAnimation(true);
    }, 0);
    // Subscribe to all actions that close the menu (outside click, item click, any other overlay detach)
    this.menuClosingActionsSubscription = this.menuClosingActions().subscribe(
      // If so, destroy menu
      () => this.destroyMenu()
    );
  }

  /**
   * Actions linked to the destruction of the current displayed menu
   *
   * @returns Observable of actions
   */
  private menuClosingActions(): Observable<MouseEvent | void> {
    const backdropClick$ = this.overlayRef.backdropClick();
    const detachment$ = this.overlayRef.detachments();
    const dropdownClosed = this.menuPanel.closed;

    return merge(backdropClick$, detachment$, dropdownClosed);
  }

  /**
   * Destroys the current menu
   */
  private destroyMenu(): void {
    if (!this.overlayRef || !this.isMenuOpen) {
      return;
    }
    // Unsubscribe to our close action subscription
    this.menuClosingActionsSubscription.unsubscribe();
    this.isMenuOpen = false;
    // We remove the needed classes to create the animation on menu close
    this.applyMenuDisplayAnimation(false);
    // Detach the previously created overlay for the menu
    setTimeout(() => {
      this.overlayRef.detach();
    }, 100);
  }

  /**
   * Apply animation to displayed menu
   *
   * @param toDisplay If the menu is going to be displayed or not
   */
  private applyMenuDisplayAnimation(toDisplay: boolean) {
    // The overlayElement is the immediate parent element containing the menu list,
    // therefor we want the immediate child in where we would apply the classes
    const menuList = this.overlayRef.overlayElement.querySelector('div');
    if (toDisplay) {
      this.renderer.addClass(menuList, 'translate-y-0');
      this.renderer.addClass(menuList, 'opacity-100');
    } else {
      this.renderer.removeClass(menuList, 'translate-y-0');
      this.renderer.removeClass(menuList, 'opacity-100');
    }
  }
}
