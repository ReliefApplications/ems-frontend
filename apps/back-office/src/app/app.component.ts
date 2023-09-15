import { Component, OnInit } from '@angular/core';
import {
  GeofieldsListboxComponent,
  SafeApplicationDropdownComponent,
  SafeAuthService,
  SafeFormService,
  SafeReferenceDataDropdownComponent,
  SafeResourceAvailableFieldsComponent,
  SafeResourceCustomFiltersComponent,
  SafeResourceDropdownComponent,
  SafeResourceSelectTextComponent,
  SafeTestServiceDropdownComponent,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

/**
 * Root component of back-office.
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
  title = 'back-office';

  /**
   * Root component of back-office
   *
   * @param authService Shared authentication service
   * @param formService Shared form service
   * @param translate Angular translate service
   */
  constructor(
    private authService: SafeAuthService,
    // We need to initialize the service there
    private formService: SafeFormService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
  }

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }
}
