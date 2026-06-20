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
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

/** Interval (ms) between background checks for a newly deployed version. */
const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000;

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
   * @param swUpdate Angular service worker update service
   */
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
    private csService: CommonServicesService,
    private swUpdate: SwUpdate
  ) {}

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
    this.listenForAppUpdates();
  }

  /** Auto-activates new SW versions and exposes a dev console hook. */
  private listenForAppUpdates(): void {
    if (!environment.production) {
      (window as any)['__testPwaUpdate'] = () => this.activateUpdateAndReload();
    }
    if (!this.swUpdate.isEnabled) return;
    // Activate and reload as soon as a new version is ready.
    this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => this.activateUpdateAndReload());
    // Poll periodically so long-lived tabs pick up new deploys without a manual navigation.
    setInterval(() => {
      this.swUpdate.checkForUpdate().catch(() => {
        /* network errors are non-fatal; retried on next interval */
      });
    }, UPDATE_CHECK_INTERVAL);
  }

  /** Activates the newly downloaded version and reloads the page. */
  private activateUpdateAndReload(): void {
    this.swUpdate
      .activateUpdate()
      .catch(() => {
        /* activation may fail if already activated; reload regardless */
      })
      .finally(() => document.location.reload());
  }
}
