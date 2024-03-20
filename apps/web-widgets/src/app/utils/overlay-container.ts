import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ShadowDomService } from '@oort-front/ui';

/**
 * Custom Overlay container, to avoid creating modals / snackbar as child of body directly.
 */
@Injectable()
export class AppOverlayContainer extends OverlayContainer {
  /**
   * Custom overlay container
   *
   * @param shadowDomService Shadow dom service
   * @param _platform Angular platform
   * @param document Current client document
   */
  constructor(
    private shadowDomService: ShadowDomService,
    _platform: Platform,
    @Inject(DOCUMENT) private document: Document
  ) {
    super(document, _platform);
  }

  /**
   * Override createContainer method in order to add the overlay element inside the shadow root if exists
   */
  override _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');

    this._containerElement = container;
    if (this.shadowDomService.currentHost?.fullscreenElement) {
      this.shadowDomService.currentHost.fullscreenElement.appendChild(
        container
      );
    } else {
      this.shadowDomService.currentHost.appendChild(container);
    }
  }

  /**
   * Update container
   *
   * @param widgetName current active widget
   */
  public updateContainer(widgetName: string): void {
    const container: HTMLDivElement = this.document.createElement('div');
    container.classList.add('app-overlay-container');

    const element = this.document
      .querySelector(widgetName)
      ?.shadowRoot?.querySelector('#angular-app-root');
    if (element) {
      element.appendChild(container);
      // eslint-disable-next-line no-underscore-dangle
      this._containerElement = container;
    }
  }
}
