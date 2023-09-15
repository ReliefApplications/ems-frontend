import { Component, OnInit, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { NgElement, WithProperties } from '@angular/elements';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';
import {
  SafeApplicationDropdownComponent,
  GeofieldsListboxComponent,
  SafeReferenceDataDropdownComponent,
  SafeResourceAvailableFieldsComponent,
  SafeResourceCustomFiltersComponent,
  SafeResourceDropdownComponent,
  SafeResourceSelectTextComponent,
  SafeTestServiceDropdownComponent,
} from '@oort-front/safe';

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
    SafeApplicationDropdownComponent,
    GeofieldsListboxComponent,
    SafeReferenceDataDropdownComponent,
    SafeResourceAvailableFieldsComponent,
    SafeResourceCustomFiltersComponent,
    SafeResourceDropdownComponent,
    SafeResourceSelectTextComponent,
    SafeTestServiceDropdownComponent,
  ];

  title = 'web-widgets';

  constructor(injector: Injector) {
    const form = createCustomElement(FormWidgetComponent, {
      injector: injector,
    });
    customElements.define('form-widget', form);
  }

  ngOnInit(): void {
    const formWidget = document.createElement('form-widget') as NgElement &
      WithProperties<{ id: string }>;
    document.getElementById('bodyPlaceholder')?.appendChild(formWidget);
  }
}
