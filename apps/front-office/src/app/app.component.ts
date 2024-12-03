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
  ];
  /** Application title */
  title = 'front-office';

  /**
   * Main component of Front-office.
   *
   * @param authService Shared authentication service,
   * @param logger Shared logger service
   */
  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {}

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }
}
