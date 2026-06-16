import { Component, NgZone, OnInit } from '@angular/core';
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
  CsDocsPropertiesDropdownComponent,
  AcceptedValueTypesTextComponent,
  CommonServicesService,
  ConfirmService,
} from '@oort-front/shared';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
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
    CsDocsPropertiesDropdownComponent,
    AcceptedValueTypesTextComponent,
  ];
  /** Application title */
  title = 'back-office';

  /**
   * Root component of back-office
   *
   * @param authService Shared authentication service
   * @param logger Shared logger service ( initialize logger so its subscription can start )
   * @param csService Common Services connector ( initialize service to create client )
   * @param swUpdate Angular service worker update service
   * @param confirmService Shared confirm modal service
   */
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
    private csService: CommonServicesService,
    private swUpdate: SwUpdate,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {}

  /**
   * Configuration of the Authentication behavior
   */
  ngOnInit(): void {
    this.authService.initLoginSequence();
    this.listenForAppUpdates();
  }

  /** Subscribes to SW version updates and exposes a dev console hook. */
  private listenForAppUpdates(): void {
    if (!environment.production) {
      (window as any)['__testPwaUpdate'] = () => this.showUpdateModal();
    }
    if (!this.swUpdate.isEnabled) return;
    this.swUpdate.versionUpdates
      .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
      .subscribe(() => this.showUpdateModal());
  }

  /** Opens the "new version available" confirm modal. */
  private showUpdateModal(): void {
    this.ngZone.run(() => {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.pwa.updateAvailable.title'),
        content: this.translate.instant(
          'components.pwa.updateAvailable.content'
        ),
        confirmText: this.translate.instant(
          'components.pwa.updateAvailable.reload'
        ),
        confirmVariant: 'primary',
      });
      dialogRef.closed.subscribe((confirmed) => {
        if (confirmed) {
          document.location.reload();
        }
      });
    });
  }
}
