import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ApplicationDropdownComponent,
  AuthService,
  GeofieldsListboxComponent,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  TestServiceDropdownComponent,
} from '@oort-front/shared';
import { SnackbarService } from '@oort-front/ui';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';

/**
 * Main component of Front-office.
 */
@Component({
  selector: 'oort-application-widget',
  templateUrl: './app-widget.component.html',
  styleUrls: ['./app-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
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
   * @param el class related element reference
   * @param injector angular application injector
   */
  constructor(
    private snackBarService: SnackbarService,
    private authService: AuthService,
    el: ElementRef,
    injector: Injector
  ) {
    const kendoPopupHost = injector.get(POPUP_CONTAINER);
    kendoPopupHost.nativeElement = el.nativeElement.shadowRoot;
    this.snackBarService.shadowDom = el.nativeElement.shadowRoot;
  }

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }
}
