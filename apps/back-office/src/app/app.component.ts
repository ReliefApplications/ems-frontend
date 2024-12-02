import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  CodeEditorComponent,
  LoggerService,
} from '@oort-front/shared';
import { filter } from 'rxjs';

/**
 * Root component of back-office.
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
    CodeEditorComponent,
  ];
  /** Application title */
  title = 'back-office';

  /**
   * Root component of back-office
   *
   * @param authService Shared authentication service
   * @param router Angular router
   * @param logger Shared logger service
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.log(event);
        if (event instanceof NavigationEnd) {
          this.logger.track({
            eventType: 'navigation',
            metadata: {
              url: event.urlAfterRedirects,
            },
          });
        }
      });
  }
}
