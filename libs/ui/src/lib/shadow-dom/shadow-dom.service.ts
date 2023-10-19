import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Shadow dom service that would host the current document host value when injected
 */
@Injectable({
  providedIn: 'root',
})
export class ShadowDomService {
  currentHost!: any;
  isShadowRoot = false;

  /**
   * Shadow dom service constructor that receives current document token
   *
   * @param {Document} document Document injection token
   */
  constructor(@Inject(DOCUMENT) document: Document) {
    const isShadowRoot = Array.from(document.getElementsByTagName('*')).filter(
      (element) => element.shadowRoot
    );
    //If shadow root exits, that would be the current document host, else the document body from the Angular injection token
    if (isShadowRoot instanceof Array && isShadowRoot.length) {
      this.isShadowRoot = true;
    }
    document.body.id;
    this.currentHost =
      isShadowRoot instanceof Array && isShadowRoot.length
        ? isShadowRoot[0].shadowRoot
        : document;
  }
}
