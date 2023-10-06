import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiConfiguration,
  authType,
  SafeApiProxyService,
  status,
  SafeBreadcrumbService,
  SafeUnsubscribeComponent,
  ApiConfigurationQueryResponse,
  EditApiConfigurationMutationResponse,
} from '@oort-front/safe';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs/operators';
import { apiValidator } from '../../../utils/nameValidation';
import { EDIT_API_CONFIGURATION } from './graphql/mutations';
import { GET_API_CONFIGURATION } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';

/**
 * Default value shown for private settings fields
 */
const ENCRYPTED_VALUE = '●●●●●●●●●●●●●';

/**
 * API configuration page component.
 */
@Component({
  selector: 'app-api-configuration',
  templateUrl: './api-configuration.component.html',
  styleUrls: ['./api-configuration.component.scss'],
})
export class ApiConfigurationComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public id = '';
  public apiConfiguration?: ApiConfiguration;

  // === FORM ===
  public apiForm: UntypedFormGroup = new UntypedFormGroup({});
  public status = status;
  public statusChoices = Object.values(status);
  public authType = authType;
  public authTypeChoices = Object.values(authType);

  /** @returns API configuration name */
  get name(): AbstractControl | null {
    return this.apiForm.get('name');
  }

  /**
   * API configuration page component
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param formBuilder Angular form builder
   * @param apiProxy Shared API proxy service
   * @param translate Angular translate service
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private apiProxy: SafeApiProxyService,
    private translate: TranslateService,
    private breadcrumbService: SafeBreadcrumbService
  ) {
    super();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apollo
        .watchQuery<ApiConfigurationQueryResponse>({
          query: GET_API_CONFIGURATION,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, loading }) => {
            if (data.apiConfiguration) {
              this.apiConfiguration = data.apiConfiguration;
              this.breadcrumbService.setBreadcrumb(
                '@api',
                this.apiConfiguration.name as string
              );
              this.apiForm = this.formBuilder.group({
                id: [{ value: this.apiConfiguration.id, disabled: true }],
                name: [
                  this.apiConfiguration?.name,
                  [Validators.required, Validators.pattern(apiValidator)],
                ],
                status: [this.apiConfiguration?.status, Validators.required],
                authType: [
                  this.apiConfiguration?.authType,
                  Validators.required,
                ],
                endpoint: [
                  this.apiConfiguration?.endpoint,
                  Validators.required,
                ],
                pingUrl: [this.apiConfiguration?.pingUrl],
                settings: this.buildSettingsForm(
                  this.apiConfiguration?.authType || ''
                ),
                graphQLEndpoint: this.apiConfiguration?.graphQLEndpoint,
              });
              this.apiForm
                .get('authType')
                ?.valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((value) => {
                  this.resetFormSettings(value);
                });
              this.loading = loading;
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.resource.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
              this.router.navigate(['/settings/apiconfigurations']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/settings/apiconfigurations']);
          },
        });
    }
  }

  /**
   * Reset settings configuration form with the given API configuration
   *
   * @param authType current auth type of the API configuration
   */
  private resetFormSettings(authType: string) {
    this.apiForm.removeControl('settings', { emitEvent: false });
    this.apiForm.addControl('settings', this.buildSettingsForm(authType));
    this.apiForm.updateValueAndValidity();
  }

  /**
   * Create the settings form depending on the authType
   *
   * @param type type of API connection
   * @returns settings form group
   */
  private buildSettingsForm(type: string): UntypedFormGroup {
    if (type === authType.serviceToService) {
      return this.formBuilder.group({
        authTargetUrl: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.authTargetUrl
            ? ENCRYPTED_VALUE
            : '',
          Validators.required,
        ],
        apiClientID: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.apiClientID
            ? ENCRYPTED_VALUE
            : '',
          Validators.minLength(3),
        ],
        safeSecret: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.safeSecret
            ? ENCRYPTED_VALUE
            : '',
          Validators.minLength(3),
        ],
        scope: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.scope
            ? ENCRYPTED_VALUE
            : '',
          null,
        ],
      });
    } else if (type === authType.userToService) {
      return this.formBuilder.group({
        token: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.token
            ? ENCRYPTED_VALUE
            : '',
          Validators.required,
        ],
      });
    }
    return this.formBuilder.group({});
  }

  /**
   * Edit the permissions layer.
   *
   * @param e permissions
   */
  saveAccess(e: any): void {
    this.loading = true;
    this.apollo
      .mutate<EditApiConfigurationMutationResponse>({
        mutation: EDIT_API_CONFIGURATION,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe(({ errors, data, loading }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              type: this.translate.instant('common.apiConfiguration.one'),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
          this.loading = false;
        } else {
          if (data) {
            this.apiConfiguration = data.editApiConfiguration;
            this.loading = loading;
          }
        }
      });
  }

  /** Edit the API Configuration using apiForm changes */
  onSave(): void {
    this.loading = true;
    const variables = { id: this.id };
    Object.assign(
      variables,
      this.apiForm.value.name !== this.apiConfiguration?.name && {
        name: this.apiForm.value.name,
      },
      this.apiForm.value.status !== this.apiConfiguration?.status && {
        status: this.apiForm.value.status,
      },
      this.apiForm.value.authType !== this.apiConfiguration?.authType && {
        authType: this.apiForm.value.authType,
      },
      this.apiForm.value.endpoint !== this.apiConfiguration?.endpoint && {
        endpoint: this.apiForm.value.endpoint,
      },
      this.apiForm.value.graphQLEndpoint !==
        this.apiConfiguration?.graphQLEndpoint && {
        graphQLEndpoint: this.apiForm.value.graphQLEndpoint,
      },
      this.apiForm.value.pingUrl !== this.apiConfiguration?.pingUrl && {
        pingUrl: this.apiForm.value.pingUrl,
      },
      // If settings is touched we will go through each settings param to save only the ones that are not the encrypted display value and that exist
      this.apiForm.controls.settings.touched && {
        settings: {
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings.authTargetUrl !== ENCRYPTED_VALUE && {
              authTargetUrl: this.apiForm.value.settings.authTargetUrl,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings.apiClientID !== ENCRYPTED_VALUE && {
              apiClientID: this.apiForm.value.settings.apiClientID,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings.safeSecret !== ENCRYPTED_VALUE && {
              safeSecret: this.apiForm.value.settings.safeSecret,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings.scope !== ENCRYPTED_VALUE && {
              scope: this.apiForm.value.settings.scope,
            }),
          ...(this.apiForm.value.authType === authType.userToService &&
            this.apiForm.value.settings.token !== ENCRYPTED_VALUE && {
              token: this.apiForm.value.settings.token,
            }),
        },
      }
    );
    this.apollo
      .mutate<EditApiConfigurationMutationResponse>({
        mutation: EDIT_API_CONFIGURATION,
        variables,
      })
      .subscribe(({ errors, data, loading }) => {
        if (errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              type: this.translate.instant('common.apiConfiguration.one'),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
          this.loading = false;
        } else {
          this.apiConfiguration = data?.editApiConfiguration;
          this.resetFormSettings(this.apiConfiguration?.authType as string);
          this.loading = loading || false;
        }
      });
  }

  /** Send a ping request to test the configuration */
  onPing(): void {
    this.apiProxy.buildPingRequest(this.apiForm.getRawValue())?.subscribe(
      (res: any) => {
        if (res) {
          if (res.access_token) {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'pages.apiConfiguration.notifications.authTokenFetched'
              )
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'pages.apiConfiguration.notifications.pingReceived'
              )
            );
          }
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'pages.apiConfiguration.notifications.pingFailed'
            ),
            { error: true }
          );
        }
      },
      () => {
        this.snackBar.openSnackBar(
          this.translate.instant(
            'pages.apiConfiguration.notifications.pingFailed'
          ),
          { error: true }
        );
      }
    );
  }

  /**
   * Clear the value of the given settings key
   *
   * @param settingsKey control key from settings control to clear
   */
  clearSettingsValue(settingsKey: string) {
    this.apiForm.get('settings')?.get(settingsKey)?.setValue('');
  }
}
