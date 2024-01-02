import { Component, ElementRef, Injector, OnInit, inject } from '@angular/core';
import { SnackbarService } from '@oort-front/ui';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { settings } from 'survey-core';

/**
 * Component for shared extended features inside component hosted in shadow dom
 */
@Component({ template: '' })
export class ShadowRootExtendedHostComponent implements OnInit {
  /** UI snackbar service */
  snackBarService: SnackbarService = inject(SnackbarService);

  /**
   * ShadowRootExtendedHostClass that would set up all needed features
   * to make the class extending it suitable for shadow dom using app-builder features
   *
   * @param el class related element reference
   * @param injector angular application injector
   */
  constructor(private el: ElementRef, injector: Injector) {
    const kendoPopupHost = injector.get(POPUP_CONTAINER);
    kendoPopupHost.nativeElement = el.nativeElement.shadowRoot;
    this.snackBarService.shadowDom = el.nativeElement.shadowRoot;
  }

  ngOnInit(): void {
    // Set svg icon container host //
    settings.environment.svgMountContainer = this.el.nativeElement.shadowRoot;
  }
}
