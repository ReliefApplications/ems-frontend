import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SidenavDirective } from './sidenav.directive';
import { Subject, takeUntil } from 'rxjs';
import { SidenavPositionTypes, SidenavTypes } from './types/sidenavs';
import { filter } from 'rxjs/operators';
import { UILayoutService } from './layout/layout.service';

/**
 * UI Sidenav component
 * Sidenav is a UI component that displays a drawer on the side of the screen.
 */
@Component({
  selector: 'ui-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent implements AfterViewInit, OnDestroy {
  /** A list of SidenavDirective children. */
  @ContentChildren(SidenavDirective) uiSidenavDirective!: SidenavDirective[];
  /** Reference to the content container. */
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  /** A list of side navigation menus. */
  @ViewChildren('sidenav') sidenav!: QueryList<any>;
  /** Reference to the content wrapper. */
  @ViewChild('contentWrapper') contentWrapper!: ElementRef;
  @ViewChild('fixedWrapperActions', { read: ViewContainerRef })
  fixedWrapperActions?: ViewContainerRef;

  /** Array indicating whether each side navigation menu should be shown. */
  public showSidenav: boolean[] = [];
  /** Array indicating the mode of each side navigation menu. */
  public mode: SidenavTypes[] = [];
  /** Array indicating the position of each side navigation menu. */
  public position: SidenavPositionTypes[] = [];
  /** Array indicating whether each side navigation menu is visible. */
  public visible: boolean[] = [];
  /** Subject to emit when the component is destroyed. */
  private destroy$ = new Subject<void>();
  /** Array of classes for animations. */
  animationClasses = ['transition-all', 'duration-500', 'ease-in-out'] as const;
  /** Should display fixed wrapper at bottom */
  fixedWrapperActionExist = false;

  /** @returns height of element */
  get height() {
    return `${this.el.nativeElement.offsetHeight}px`;
  }

  /**
   * Set the drawer height and width on resize
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.uiSidenavDirective.forEach((sidenavDirective, index) => {
      this.setRightSidenavHeight(
        this.sidenav.get(index).nativeElement,
        sidenavDirective
      );
    });
  }

  /**
   * UI Sidenav constructor
   *
   * @param renderer Renderer2
   * @param cdr ChangeDetectorRef
   * @param el elementRef
   * @param router Angular router
   * @param layoutService Layout service that handles view injection of the fixed wrapper actions if exists
   */
  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    public el: ElementRef,
    private router: Router,
    private layoutService: UILayoutService
  ) {}

  ngAfterViewInit() {
    this.layoutService.fixedWrapperActions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view) => {
        if (view && this.fixedWrapperActions) {
          this.fixedWrapperActionExist = true;
          this.fixedWrapperActions.createEmbeddedView(view);
        } else {
          if (this.fixedWrapperActions) {
            this.fixedWrapperActionExist = false;
            this.fixedWrapperActions.clear();
          }
        }
      });
    // Listen to router events to auto scroll to top of the view
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.contentWrapper.nativeElement.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    // Initialize width and show sidenav value
    this.uiSidenavDirective.forEach((sidenavDirective, index) => {
      this.showSidenav[index] = sidenavDirective.opened;
      this.mode[index] = sidenavDirective.mode;
      this.position[index] = sidenavDirective.position;
      this.setRightSidenavHeight(
        this.sidenav.get(index).nativeElement,
        sidenavDirective
      );
      this.cdr.detectChanges();
      this.renderer.appendChild(
        this.sidenav.get(index).nativeElement.querySelector('div'),
        sidenavDirective.el.nativeElement
      );
      sidenavDirective.openedChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((opened: boolean) => {
          this.showSidenav[index] = opened;
          // Change the mode if it has changed since last opening/closure
          this.mode[index] = sidenavDirective.mode;
        });
    });

    //Then set the transitions
    setTimeout(() => {
      this.setTransitionForContent();
    }, 0);
  }

  /**
   * recalculates right sidenav height
   *
   * @param sidenavElement right sidenav element to recalculate the size of
   * @param sidenavDirective sidenavDirective to check if the sidenav is at the right side
   */
  setRightSidenavHeight(
    sidenavElement: any,
    sidenavDirective: SidenavDirective
  ) {
    if (sidenavDirective.position === 'end') {
      this.renderer.removeClass(sidenavElement, 'h-full');
      this.renderer.setStyle(
        sidenavElement,
        'height',
        `${this.el.nativeElement.clientHeight}px`
      );
    }
  }

  /**
   * Resolve sidenav classes by given properties
   *
   * @param index of the sidenav
   * @returns classes for the sidenav depending on it's properties
   */
  resolveSidenavClasses(index: number): string[] {
    const classes = [];
    if (this.position[index] === 'start') {
      classes.push("data-[sidenav-show='false']:-translate-x-full");
      classes.push("data-[sidenav-show='false']:w-0");
      classes.push('z-[1002]');
      classes.push('w-60');
      classes.push('border-r');
      classes.push('border-gray-200');
    }
    if (this.mode[index] === 'over') {
      classes.push('h-full');
      classes.push('left-0');
      classes.push('top-0');
      classes.push('fixed');
    }
    if (this.position[index] === 'end') {
      classes.push('absolute');
      classes.push('right-0');
      classes.push("data-[sidenav-show='false']:translate-x-full");
      classes.push('z-[997]');
      classes.push(
        'shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)]'
      );
    }
    return classes;
  }

  /**
   * Set the transition properties to the content adjacent to the sidenav
   */
  private setTransitionForContent() {
    this.animationClasses.forEach((aClass) => {
      this.renderer.addClass(this.contentContainer.nativeElement, aClass);
      this.sidenav.forEach((side) => {
        this.renderer.addClass(side.nativeElement, aClass);
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
