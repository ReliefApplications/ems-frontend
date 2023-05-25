import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SidenavDirective } from './sidenav.directive';
import { Subject, takeUntil } from 'rxjs';
import { SidenavPositionTypes, SidenavTypes } from './types/sidenavs';

/**
 * UI Sidenav component
 */
@Component({
  selector: 'ui-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(SidenavDirective) uiSidenavDirective!: SidenavDirective[];
  @ViewChild('content') content!: ElementRef;
  @ViewChildren('sidenav') sidenav!: QueryList<any>;

  public showSidenav: boolean[] = [];
  public mode: SidenavTypes[] = [];
  public position: SidenavPositionTypes[] = [];
  private destroy$ = new Subject<void>();
  animationClasses = ['transition-all', 'duration-500', 'ease-in-out'] as const;

  /**
   * UI Sidenav constructor
   *
   * @param renderer Renderer2
   */
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Initialize width and show sidenav value
    this.uiSidenavDirective.forEach((sidenavDirective, index) => {
      this.showSidenav[index] = sidenavDirective.opened;
      this.mode[index] = sidenavDirective.mode;
      this.position[index] = sidenavDirective.position;
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
   * Resolve sidenav classes by given properties
   *
   * @param index of the sidenav
   * @returns classes for the sidenav depending on it's properties
   */
  resolveSidenavClasses(index: number): string[] {
    const classes = [];
    if (this.position[index] === 'start') {
      classes.push("data-[sidenav-show='false']:-translate-x-full");
      classes.push('z-[999]');
      classes.push('w-60');
    }
    if (this.mode[index] === 'over') {
      classes.push('left-0');
      classes.push('top-0');
      classes.push('fixed');
    }
    if (this.position[index] === 'end') {
      classes.push('absolute ');
      classes.push('right-0 ');
      classes.push("data-[sidenav-show='false']:translate-x-full");
      classes.push('z-[997]');
    }
    return classes;
  }

  /**
   * Set the transition properties to the content adjacent to the sidenav
   */
  private setTransitionForContent() {
    this.animationClasses.forEach((aClass) => {
      this.renderer.addClass(this.content.nativeElement, aClass);
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
