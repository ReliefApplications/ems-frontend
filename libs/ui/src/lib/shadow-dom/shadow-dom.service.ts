import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Shadow dom service that would host the current document host value when injected
 */
@Injectable({
  providedIn: 'root',
})
export class ShadowDomService {
  /** @returns is using a shadow root or not */
  get isShadowRoot() {
    return !!this.shadowRoot;
  }

  /** @returns current host, either the shadow root, or the document */
  get currentHost() {
    return this.shadowRoot || this.document;
  }

  public shadowRoot?: ShadowRoot;

  /**
   * Shadow dom service constructor that receives current document token
   *
   * @param {Document} document Document injection token
   */
  constructor(@Inject(DOCUMENT) private document: Document) {}
}
