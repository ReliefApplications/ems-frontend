import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationDropdownComponent,
  AuthService,
  FormService,
  GeofieldsListboxComponent,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  TestServiceDropdownComponent,
} from '@oort-front/shared';
import { SnackbarService } from '@oort-front/ui';
import { environment } from '../../../environments/environment';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { ApplicationModule } from './application/application.module';
import { CommonModule } from '@angular/common';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'oort-web-widget-app',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, ApplicationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppWidgetComponent implements OnInit {
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
  @Input() appID = '63c9610ec7dee6439fe33604';
  title = 'front-office';

  /**
   * Main component of Front-office.
   *
   * @param snackBarService snackbar service to set the current attached shadow root
   * @param authService Shared authentication service
   * @param formService Shared form service
   * @param translate Angular translate service
   * @param el class related element reference
   * @param injector angular application injector
   */
  constructor(
    private snackBarService: SnackbarService,
    private authService: AuthService,
    // We need to initialize the service there
    private formService: FormService,
    private translate: TranslateService,
    el: ElementRef,
    injector: Injector
  ) {
    const kendoPopupHost = injector.get(POPUP_CONTAINER);
    kendoPopupHost.nativeElement = el.nativeElement.shadowRoot;
    this.snackBarService.shadowDom = el.nativeElement.shadowRoot;
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
