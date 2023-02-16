import { Injectable } from '@angular/core';

/**
 * Shared fullscreen service. Handles fullscreen events for components.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeFullScreenService {
  // Current component on fullscreen
  private component: HTMLElement | null = null;

  /**
   * On fullscreen events, checks if user exited fullscreen mode
   * without using the button and reset settings.
   */
  constructor() {
    addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.component) {
        this.component?.classList.remove(
          'mat-drawer-content',
          'mat-sidenav-content',
          'mat-dialog-container'
        );
        this.component = null;
      }
    });
  }

  /**
   * Receives a component and puts it in fullscreen mode
   *
   * @param {HTMLElement} component to put on fullscreen mode
   */
  public goFullScreen(component: HTMLElement): void {
    component.classList.add(
      'mat-drawer-content',
      'mat-sidenav-content',
      'mat-dialog-container'
    );
    if (!document.fullscreenElement && !this.component) {
      component.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.component = component;
  }
}
