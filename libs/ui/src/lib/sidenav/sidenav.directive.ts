import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Renderer2,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { SidenavPositionTypes, SidenavTypes } from './types/sidenavs';

/**
 * UI Sidenav directive
 */
@Directive({
  selector: '[uiSidenavDirective]',
  exportAs: 'uiSidenavDirective',
})
export class SidenavDirective implements OnInit, OnDestroy, OnChanges {
  @Input() opened = true;
  @Input() visible = true;
  @Input() mode: SidenavTypes = 'side';
  @Input() position: SidenavPositionTypes = 'start';
  @Output() openedChange = new EventEmitter<boolean>();

  private clickOutsideListener!: any;
  private toggleUsed = false;

  /**
   * UI Sidenav directive constructor
   *
   * @param el host element
   * @param renderer Renderer2
   */
  constructor(public el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.clickOutsideListener = this.renderer.listen(
      window,
      'click',
      (event) => {
        if (
          !this.toggleUsed &&
          this.opened &&
          !this.el.nativeElement.contains(event.target) &&
          this.mode === 'over'
        ) {
          this.opened = false;
          this.openedChange.emit(this.opened);
        }
      }
    );
  }

  ngOnChanges(change: SimpleChanges) {
    this.opened = change['opened']?.currentValue ?? false;
    this.openedChange.emit(this.opened);
  }

  /** Handles the toggle of the sidenav status */
  public toggle() {
    this.toggleUsed = true;
    setTimeout(() => {
      this.opened = !this.opened;
      this.openedChange.emit(this.opened);
      this.toggleUsed = false;
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
  }
}
