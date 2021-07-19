import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfiguration, authType, NOTIFICATIONS, SafeSnackBarService } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { SafeApiProxyService, status } from 'projects/safe/src/public-api';
import { Subscription } from 'rxjs';
import { EditApiConfigurationMutationResponse, EDIT_API_CONFIGURATIION } from '../../../graphql/mutations';
import { GetApiConfigurationQueryResponse, GET_API_CONFIGURATION } from '../../../graphql/queries';

@Component({
  selector: 'app-api-configuration',
  templateUrl: './api-configuration.component.html',
  styleUrls: ['./api-configuration.component.scss']
})
export class ApiConfigurationComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public id = '';
  public apiConfiguration?: ApiConfiguration;
  private apolloSubscription?: Subscription;

  // === FORM ===
  public apiForm: FormGroup = new FormGroup({});
  public statusChoices = Object.values(status);
  public authTypeChoices = Object.values(authType);

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiProxy: SafeApiProxyService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apolloSubscription = this.apollo.watchQuery<GetApiConfigurationQueryResponse>({
        query: GET_API_CONFIGURATION,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe(res => {
        if (res.data.apiConfiguration) {
          this.apiConfiguration = res.data.apiConfiguration;
          this.apiForm = this.formBuilder.group(
            {
              name: [this.apiConfiguration?.name, Validators.required],
              status: [this.apiConfiguration?.status, Validators.required],
              authType: [this.apiConfiguration?.authType, Validators.required],
              endpoint: [this.apiConfiguration?.endpoint, Validators.required],
              pingUrl: [this.apiConfiguration?.pingUrl],
              settings: this.buildSettingsForm(this.apiConfiguration?.authType || '')
            }
          );
          this.loading = res.data.loading;
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('resource'), { error: true });
          this.router.navigate(['/settings/apiconfigurations']);
        }
      }, (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/settings/apiconfigurations']);
      });
    }

    this.apiForm.get('authType')?.valueChanges.subscribe(value => {
      this.apiForm.controls.settings = this.buildSettingsForm(value);
    });
  }

  /*  Unsubscribe from the apollo subscription if needed
  */
  ngOnDestroy(): void {
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
  }

  /*  Create the settings form depending on the authType
  */
  private buildSettingsForm(type: string): FormGroup {
    if (type === 'service-to-service') {
      return this.formBuilder.group({
        authTargetUrl: [this.apiConfiguration?.settings && this.apiConfiguration?.settings.authTargetUrl
          ? '●●●●●●●●●●●●●' : '', Validators.required],
        apiClientID: [this.apiConfiguration?.settings && this.apiConfiguration?.settings.apiClientID
          ? '●●●●●●●●●●●●●' : '', Validators.minLength(3)],
        safeSecret: [this.apiConfiguration?.settings && this.apiConfiguration?.settings.safeSecret
          ? '●●●●●●●●●●●●●' : '', Validators.minLength(3)],
        safeID: [this.apiConfiguration?.settings && this.apiConfiguration?.settings.safeID
          ? '●●●●●●●●●●●●●' : '', Validators.minLength(3)]
      });
    }
    return this.formBuilder.group({});
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
    this.loading = true;
    this.apollo.mutate<EditApiConfigurationMutationResponse>({
      mutation: EDIT_API_CONFIGURATIION,
      variables: {
        id: this.id,
        permissions: e
      }
    }).subscribe(res => {
      if (res.data) {
        this.apiConfiguration = res.data.editApiConfiguration;
        this.loading = res.data.loading;
      }
    });
  }

  /*  Edit the API Configuration using apiForm changes
  */
  onSave(): void {
    if (this.apolloSubscription) {
      this.apolloSubscription.unsubscribe();
    }
    this.loading = true;
    this.apollo.mutate<EditApiConfigurationMutationResponse>({
      mutation: EDIT_API_CONFIGURATIION,
      variables: {
        id: this.id,
        name: this.apiForm.value.name,
        status: this.apiForm.value.status,
        authType: this.apiForm.value.authType,
        endpoint: this.apiForm.value.endpoint,
        pingUrl: this.apiForm.value.pingUrl,
        settings: this.apiForm.controls.settings.value // Fix problem if we pass ●●●●●●●●●●●●●
      }
    }).subscribe(res => {
      if (res.data) {
        this.apiConfiguration = res.data.editApiConfiguration;
        this.apiForm.controls.settings = this.buildSettingsForm(this.apiForm.value.authType);
        this.apiForm.markAsPristine();
        this.loading = res.data.loading;
      }
    });
  }

  /*  Send a ping request to test the configuration
  */
  onPing(): void {
    this.apiProxy.buildPingRequest(this.apiConfiguration?.name, this.apiForm.value.pingUrl)?.subscribe((res: any) => {
      if (res) {
        if (res.access_token) {
          this.snackBar.openSnackBar(NOTIFICATIONS.pingResponseAuthToken);
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.pingResponseReceived);
        }
      } else {
        this.snackBar.openSnackBar(NOTIFICATIONS.pingResponseError, {error: true});
      }
    });
  }
}
