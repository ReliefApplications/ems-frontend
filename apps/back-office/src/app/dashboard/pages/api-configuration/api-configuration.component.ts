import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiConfiguration,
  authType,
  ApiProxyService,
  status,
  BreadcrumbService,
  UnsubscribeComponent,
  ApiConfigurationQueryResponse,
  EditApiConfigurationMutationResponse,
} from '@oort-front/shared';
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
  extends UnsubscribeComponent
  implements OnInit
{
  /** Loading indicator */
  public loading = true;
  /** Api configuration id */
  public id = '';
  /** Edited api configuration */
  public apiConfiguration?: ApiConfiguration;
  /** Api form group */
  public apiForm!: ReturnType<typeof this.createApiForm>;
  /** Reference to status enum */
  public status = status;
  /** Available status choices */
  public statusChoices = Object.values(status);
  /** Reference to auth type enum */
  public authType = authType;
  /** Available auth types */
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
   * @param fb Angular form builder
   * @param apiProxy Shared API proxy service
   * @param translate Angular translate service
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private fb: FormBuilder,
    private apiProxy: ApiProxyService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService
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
              this.apiForm = this.createApiForm(data.apiConfiguration);
              this.apiForm.controls.authType?.valueChanges
                .pipe(takeUntil(this.destroy$))
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
   * Create API form
   *
   * @param api API configuration
   * @returns form group
   */
  private createApiForm(api: ApiConfiguration) {
    return this.fb.group({
      id: [{ value: api.id, disabled: true }],
      name: [api.name, [Validators.required, Validators.pattern(apiValidator)]],
      status: [api.status, Validators.required],
      authType: this.fb.nonNullable.control(
        api.authType || '',
        Validators.required
      ),
      endpoint: [api.endpoint, Validators.required],
      pingUrl: [api.pingUrl],
      settings: this.buildSettingsForm(api.authType || ''),
      graphQLEndpoint: api.graphQLEndpoint,
    });
  }

  /**
   * Reset settings configuration form with the given API configuration
   *
   * @param authType current auth type of the API configuration
   */
  private resetFormSettings(authType: string) {
    (this.apiForm as any).removeControl('settings', { emitEvent: false });
    this.apiForm.addControl('settings', this.buildSettingsForm(authType));
    this.apiForm.updateValueAndValidity();
  }

  /**
   * Create the settings form depending on the authType
   *
   * @param type type of API connection
   * @returns settings form group
   */
  private buildSettingsForm(type: string) {
    if (type === authType.serviceToService) {
      return this.fb.group({
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
      return this.fb.group({
        token: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.token
            ? ENCRYPTED_VALUE
            : '',
          Validators.required,
        ],
      });
    }
    return this.fb.group({});
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
        } else {
          if (data) {
            this.apiConfiguration = data.editApiConfiguration;
          }
        }
        this.loading = loading;
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
            this.apiForm.value.settings?.authTargetUrl !== ENCRYPTED_VALUE && {
              authTargetUrl: this.apiForm.value.settings?.authTargetUrl,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings?.apiClientID !== ENCRYPTED_VALUE && {
              apiClientID: this.apiForm.value.settings?.apiClientID,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings?.safeSecret !== ENCRYPTED_VALUE && {
              safeSecret: this.apiForm.value.settings?.safeSecret,
            }),
          ...(this.apiForm.value.authType === authType.serviceToService &&
            this.apiForm.value.settings?.scope !== ENCRYPTED_VALUE && {
              scope: this.apiForm.value.settings?.scope,
            }),
          ...(this.apiForm.value.authType === authType.userToService &&
            this.apiForm.value.settings?.token !== ENCRYPTED_VALUE && {
              token: this.apiForm.value.settings?.token,
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
        } else {
          this.apiConfiguration = data?.editApiConfiguration;
          this.resetFormSettings(this.apiConfiguration?.authType as string);
          this.loading = loading || false;
        }
        this.loading = loading;
      });
  }

  /** Send a ping request to test the configuration */
  onPing(): void {
    this.apiProxy
      .buildPingRequest(this.apiForm.getRawValue() as ApiConfiguration)
      ?.subscribe(
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
   * Clear the value of the given control, if not updated by the user
   *
   * @param key control key from settings control to clear
   */
  clearControl(key: string) {
    const control = this.apiForm.get(key);
    if (control && control.pristine) {
      control.setValue('');
    }
  }
}
