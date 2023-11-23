import { Component } from '@angular/core';
import {
  ApplicationDropdownComponent,
  GeofieldsListboxComponent,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  SurveyQueriesComponent,
  TestServiceDropdownComponent,
} from '@oort-front/shared';

/**
 * Root component of Web Widgets project.
 */
@Component({
  selector: 'oort-app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
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
    SurveyQueriesComponent,
  ];

  title = 'web-widgets';
}
