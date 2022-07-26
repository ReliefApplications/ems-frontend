import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

/**
 * Custom Overlay container, to avoid creating modals / snackbar as child of body directly.
 */
@Injectable()
export class AppOverlayContainer extends OverlayContainer {
  /**
   * Custom overlay container
   *
   * @param _platform Angular platform
   */
  constructor(_platform: Platform) {
    super(document, _platform);
  }

  /**
   * Update container
   *
   * @param widgetName current active widget
   */
  public updateContainer(widgetName: string): void {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('app-overlay-container');

    const element = document
      .querySelector(widgetName)
      ?.shadowRoot?.querySelector('#angular-app-root');
    if (element) {
      element.appendChild(container);
      // eslint-disable-next-line no-underscore-dangle
      this._containerElement = container;
    }
  }
}
