import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SidenavDirective } from './sidenav.directive';
import { Subject, takeUntil } from 'rxjs';
import { SidenavTypes } from './types/sidenavs';

/**
 * UI Sidenav component
 */
@Component({
  selector: 'ui-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
})
export class SidenavContainerComponent implements AfterViewInit, OnDestroy {
  @ContentChild(SidenavDirective) uiSidenavDirective!: SidenavDirective;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('sidenav') sidenav!: ElementRef;

  public showSidenav!: boolean;
  public mode!: SidenavTypes;
  private destroy$ = new Subject<void>();
  sidenavWidth = 0;
  animationClasses = ['transition-all', 'duration-500', 'ease-in-out'] as const;

  /**
   * UI Sidenav constructor
   *
   * @param renderer Renderer2
   */
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Initialize width and show sidenav value
    this.sidenavWidth = this.sidenav.nativeElement.clientWidth;
    this.showSidenav = this.uiSidenavDirective.opened;
    this.mode = this.uiSidenavDirective.mode;

    // If is set to show, move the content
    if (this.showSidenav && this.mode === 'side') {
      this.moveContent();
    }

    //Then set the transitions
    setTimeout(() => {
      this.setTransitionForContent();
    }, 0);

    this.renderer.addClass(this.content.nativeElement, 'overflow-y-auto');
    this.renderer.addClass(this.content.nativeElement, 'm-2');
    this.renderer.addClass(this.content.nativeElement, 'flex-col');

    this.uiSidenavDirective.openedChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((opened: boolean) => {
        this.showSidenav = opened;
        // Change the mode if it has changed since last opening/closure
        this.mode = this.uiSidenavDirective.mode;
        // if (this.mode === 'side') {
        this.moveContent();
        // }
      });
  }

  /**
   * Move the content taking in account current sidenav width
   * Padding used as set in the tailwind official elements https://tailwind-elements.com/docs/standard/navigation/sidenav/#positioning
   */
  private moveContent() {
    if (this.showSidenav && this.mode === 'side') {
      this.renderer.setStyle(
        this.content.nativeElement,
        'padding-left',
        `${this.sidenavWidth}px`
      );
    } else {
      this.renderer.removeStyle(this.content.nativeElement, 'padding-left');
    }
  }

  /**
   * Set the transition properties to the content adjacent to the sidenav
   */
  private setTransitionForContent() {
    this.animationClasses.forEach((aClass) => {
      this.renderer.addClass(this.content.nativeElement, aClass);
      this.renderer.addClass(this.sidenav.nativeElement, aClass);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
