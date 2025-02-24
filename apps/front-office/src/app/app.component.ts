import { Component, OnInit } from '@angular/core';
import {
  GeofieldsListboxComponent,
  ApplicationDropdownComponent,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  TestServiceDropdownComponent,
  AuthService,
  LoggerService,
  CsDocsPropertiesDropdownComponent,
  AcceptedValueTypesTextComponent,
  CommonServicesService,
} from '@oort-front/shared';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** Static component declaration of survey custom components for the property grid editor in order to avoid removal on tree shake for production build */
  static declaration = [
    ApplicationDropdownComponent,
    GeofieldsListboxComponent,
    ReferenceDataDropdownComponent,
    ResourceAvailableFieldsComponent,
    ResourceCustomFiltersComponent,
    ResourceDropdownComponent,
    ResourceSelectTextComponent,
    TestServiceDropdownComponent,
    CsDocsPropertiesDropdownComponent,
    AcceptedValueTypesTextComponent,
  ];
  /** Application title */
  title = 'front-office';

  /**
   * Main component of Front-office.
   *
   * @param authService Shared authentication service,
   * @param logger Shared logger service ( initialize logger so its subscription can start )
   * @param csService Common Services connector ( initialize service to create client )
   */
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
    private csService: CommonServicesService
  ) {}

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }
}
