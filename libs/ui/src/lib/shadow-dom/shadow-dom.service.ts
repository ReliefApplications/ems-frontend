import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';

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

  /**
   * Returns the first shadowDOM found containing the element passed, if not it returns null
   *
   * @param {ElementRef} element Angular ElementRef
   * @returns ShadowRoot of the found shadowDOM or null if nothing is found
   */
  public getShadowRoot(element: ElementRef): ShadowRoot | null {
    const shadowDOMArray = Array.from(
      document.getElementsByTagName('*')
    ).filter((element) => element.shadowRoot);
    //If shadow root exits, that would be the current document host, else the document body from the Angular injection token
    if (shadowDOMArray instanceof Array && shadowDOMArray.length) {
      for (const dom of shadowDOMArray) {
        if (dom.contains(element.nativeElement)) {
          return dom.shadowRoot;
        }
      }
    }
    return null;
  }
}
