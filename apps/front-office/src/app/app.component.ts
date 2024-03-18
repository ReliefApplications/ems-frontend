import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import {
  GeofieldsListboxComponent,
  ApplicationDropdownComponent,
  AuthService,
  ReferenceDataDropdownComponent,
  ResourceAvailableFieldsComponent,
  ResourceCustomFiltersComponent,
  ResourceDropdownComponent,
  ResourceSelectTextComponent,
  TestServiceDropdownComponent,
} from '@oort-front/shared';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { Router } from '@angular/router';

/**
 * Parses a query string and returns an object with key-value pairs.
 *
 * @param queryString The query string to parse.
 * @returns An object with key-value pairs representing the parsed query string.
 */
const parseQuery = (queryString: string): Record<string, string> => {
  if (!queryString) {
    return {};
  }

  const query: Record<string, string> = {};
  const pairs = (
    queryString[0] === '?' ? queryString.substring(1) : queryString
  ).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};

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
   * @param authService Shared authentication service
   * @param translate Angular translate service
   * @param kendoIntl Kendo Intl Service
   * @param router Angular router service
   */
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private kendoIntl: IntlService,
    private router: Router
  ) {
    this.translate.addLangs(environment.availableLanguages);
    this.translate.setDefaultLang(environment.availableLanguages[0]);
    (this.kendoIntl as CldrIntlService).localeId =
      environment.availableLanguages[0];
  }

  /**
   * Intercept click event on the document to check if the clicked element is a button or a link
   * If so, and the element has a href attribute, check if the href is from the same origin
   * If so, navigate to the url using the router to avoid page reload
   *
   * @param event Click event
   */
  @HostListener('click', ['$event'])
  interceptClick(event: Event) {
    const isRelativeUrl = (href: string): boolean => {
      try {
        new URL(href);
        // No error, so it's an absolute URL
        return false;
      } catch (error) {
        // Error occurred, indicating it's likely a relative URL
        return true;
      }
    };
    if (
      event.target instanceof HTMLButtonElement ||
      event.target instanceof HTMLAnchorElement
    ) {
      // Check if the element has a href attribute
      const href = event.target.getAttribute('href');

      // Check if should open on the same tab
      const target = event.target.getAttribute('target');
      const openOnSameTab = !target || target === '_self';

      if (
        href &&
        openOnSameTab &&
        (href.startsWith(environment.frontOfficeUri) || isRelativeUrl(href))
      ) {
        // Navigate to the url in the href using the router
        event.preventDefault();
        const regex = new RegExp(`^${environment.frontOfficeUri}`);
        const [route, params] = href.replace(regex, '').split('?');
        const queryParams = parseQuery(params);
        this.router.navigate([route], { queryParams }).catch(() => {
          // If the navigation fails, fallback to window.location.href
          window.location.href = href;
        });
      }
    }
  }

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
  }
}
