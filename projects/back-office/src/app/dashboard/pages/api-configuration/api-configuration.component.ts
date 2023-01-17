import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApiConfiguration,
  authType,
  SafeSnackBarService,
  SafeApiProxyService,
  status,
  SafeBreadcrumbService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs/operators';
import { apiValidator } from '../../../utils/nameValidation';
import {
  EditApiConfigurationMutationResponse,
  EDIT_API_CONFIGURATION,
} from './graphql/mutations';
import {
  GetApiConfigurationQueryResponse,
  GET_API_CONFIGURATION,
} from './graphql/queries';

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
  public apiForm: FormGroup = new FormGroup({});
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
   * @param snackBar Shared snackar service
   * @param router Angular router
   * @param formBuilder Angular form builder
   * @param apiProxy Shared API proxy service
   * @param translate Angular translate service
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private formBuilder: FormBuilder,
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
        .watchQuery<GetApiConfigurationQueryResponse>({
          query: GET_API_CONFIGURATION,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.data.apiConfiguration) {
              this.apiConfiguration = res.data.apiConfiguration;
              this.breadcrumbService.setBreadcrumb(
                '@api',
                this.apiConfiguration.name as string
              );
              this.apiForm = this.formBuilder.group({
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
              this.apiForm.get('authType')?.valueChanges.subscribe((value) => {
                this.apiForm.controls.settings.clearValidators();
                this.apiForm.controls.settings = this.buildSettingsForm(value);
                this.apiForm.controls.settings.updateValueAndValidity();
              });
              this.loading = res.loading;
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
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/settings/apiconfigurations']);
          }
        );
    }
  }

  /**
   * Create the settings form depending on the authType
   *
   * @param type type of API connection
   * @returns settings form group
   */
  private buildSettingsForm(type: string): FormGroup {
    if (type === authType.serviceToService) {
      return this.formBuilder.group({
        authTargetUrl: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.authTargetUrl
            ? '●●●●●●●●●●●●●'
            : '',
          Validators.required,
        ],
        apiClientID: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.apiClientID
            ? '●●●●●●●●●●●●●'
            : '',
          Validators.minLength(3),
        ],
        safeSecret: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.safeSecret
            ? '●●●●●●●●●●●●●'
            : '',
          Validators.minLength(3),
        ],
        scope: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.scope
            ? '●●●●●●●●●●●●●'
            : '',
          null,
        ],
      });
    } else if (type === authType.userToService) {
      return this.formBuilder.group({
        token: [
          this.apiConfiguration?.settings &&
          this.apiConfiguration?.settings.token
            ? '●●●●●●●●●●●●●'
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
      .subscribe((res) => {
        if (res.data) {
          this.apiConfiguration = res.data.editApiConfiguration;
          this.loading = res.loading;
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
      this.apiForm.controls.settings.touched && {
        settings: this.apiForm.controls.settings.value,
      }
    );
    this.apollo
      .mutate<EditApiConfigurationMutationResponse>({
        mutation: EDIT_API_CONFIGURATION,
        variables,
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.objectNotUpdated', {
              type: this.translate.instant('common.apiConfiguration.one'),
              error: res.errors[0].message,
            }),
            { error: true }
          );
          this.loading = res.loading;
        } else {
          this.apiConfiguration = res.data?.editApiConfiguration;
          this.apiForm.controls.settings = this.buildSettingsForm(
            this.apiForm.value.authType
          );
          this.apiForm.markAsPristine();
          this.loading = res.loading;
        }
      });
  }

  /** Send a ping request to test the configuration */
  onPing(): void {
    this.apiProxy
      .buildPingRequest(this.apiConfiguration?.name, this.apiForm.value.pingUrl)
      ?.subscribe((res: any) => {
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
      });
  }
}
