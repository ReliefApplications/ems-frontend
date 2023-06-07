import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { moveItemInArray } from '@angular/cdk/drag-drop';
/**
 * The navbar navigator used in the main layout
 */
@Component({
  selector: 'safe-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class SafeNavbarComponent {
  @Input() appLayout = false;
  @Input() canAddPage = false;
  @Output() reorder: EventEmitter<any> = new EventEmitter();

  // === NAVIGATION GROUP ===
  @Input() navGroups: any[] = [];
  @Input() nav: any;

  private environment: any;

  /**
   * Left navbar visible in application edition and preview.
   *
   * @param environment This is the environment in which we are running the application
   * @param router The Angular Router service
   */
  constructor(@Inject('environment') environment: any, private router: Router) {
    this.environment = environment;
  }

  /**
   * Handles the click event
   *
   * @param callback Callback that defines the action to perform on click
   * @param event Event that happends with the click
   */
  onClick(callback: () => any, event: any): void {
    callback();
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Drop event handler. Move item in layout navigation item list.
   *
   * @param event drop event
   * @param group group where the event occurs
   */
  drop(event: any, group: any): void {
    moveItemInArray(group.navItems, event.previousIndex, event.currentIndex);
    this.reorder.emit(group.navItems);
  }
}
