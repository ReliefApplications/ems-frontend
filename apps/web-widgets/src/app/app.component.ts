import { Component, OnInit, Injector, Inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { NgElement, WithProperties } from '@angular/elements';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationDropdownComponent,
  GeofieldsListboxComponent,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  TestServiceDropdownComponent,
} from '@oort-front/shared';

/**
 * Root component of Web Widgets project.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Static component declaration of survey custom components for the property grid editor in order to avoid removal on tree shake for production build
  static declaration = [
    ApplicationDropdownComponent,
    GeofieldsListboxComponent,
    ReferenceDataDropdownComponent,
    ResourceAvailableFieldsComponent,
    ResourceCustomFiltersComponent,
    ResourceDropdownComponent,
    ResourceSelectTextComponent,
    TestServiceDropdownComponent,
  ];

  title = 'web-widgets';

  constructor(
    injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    const form = createCustomElement(FormWidgetComponent, {
      injector: injector,
    });
    customElements.define('form-widget', form);
  }

  ngOnInit(): void {
    const formWidget = this.document.createElement('form-widget') as NgElement &
      WithProperties<{ id: string }>;
    this.document.getElementById('bodyPlaceholder')?.appendChild(formWidget);
  }
}
