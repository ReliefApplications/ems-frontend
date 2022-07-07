import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  SafeSnackBarService,
  Setting,
  createFormGroup,
  ApiConfiguration,
} from '@safe/builder';
import {
  GetApiConfigurationsQueryResponse,
  GetSettingQueryResponse,
  GET_API_CONFIGURATIONS,
  GET_SETTING,
} from '../../../../graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import {
  EditSettingMutationResponse,
  EDIT_SETTING,
} from '../../../../graphql/mutations';
import { MatSelect } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';

const ITEMS_PER_PAGE = 10;

/**
 * Advanced user settings component.
 */
@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss'],
})
export class AdvancedSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  settingForm: FormGroup = new FormGroup({});
  loading = true;

  // === API CONFIGURATIONS ===
  private defaultApiConfiguration?: ApiConfiguration;
  @ViewChild('apiSelect') apiSelect?: MatSelect;
  private apiConfigurationsLoading = true;
  public apiConfigurations = new BehaviorSubject<ApiConfiguration[]>([]);
  public apiConfigurations$!: Observable<ApiConfiguration[]>;
  private apiConfigurationsQuery!: QueryRef<GetApiConfigurationsQueryResponse>;
  private apiPageInfo = {
    endCursor: '',
    hasNextPage: true,
  };

  /**
   * Getter to have the user management mappingForm in the correct type.
   *
   * @returns mappingForm
   */
  get mappingForm(): FormArray {
    return this.settingForm.get(
      'userManagement.attributesMapping'
    ) as FormArray;
  }
  /**
   * Constructor for AdvancedSettingsComponent.
   *
   * @param formBuilder Angular form builder
   * @param apollo Angular apollo server
   * @param snackBar Safe notification service
   * @param translateService Angular i18n service
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    // Fetch settings
    this.apollo
      .query<GetSettingQueryResponse>({ query: GET_SETTING })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.accessNotProvided',
              {
                type: this.translateService.instant(
                  'components.users.advancedSettings.title'
                ),
                error: res.errors[0],
              }
            ),
            { error: true }
          );
        } else {
          console.log('FOo');
          const setting = res.data.setting;
          const isNotLocal =
            setting &&
            setting.userManagement &&
            setting.userManagement.local === false;
          if (isNotLocal) {
            this.defaultApiConfiguration =
              setting.userManagement?.apiConfiguration;
            this.initApiConfigurations();
          }
          // Init the form
          this.settingForm = this.formBuilder.group({
            userManagement: this.formBuilder.group({
              local: [
                setting &&
                setting.userManagement &&
                setting.userManagement.local !== undefined
                  ? setting.userManagement.local
                  : true,
                Validators.required,
              ],
              apiConfiguration: [
                setting &&
                setting.userManagement &&
                setting.userManagement.apiConfiguration
                  ? setting.userManagement.apiConfiguration.id
                  : '',
                isNotLocal ? Validators.required : null,
              ],
              serviceAPI: [
                setting &&
                setting.userManagement &&
                setting.userManagement.serviceAPI
                  ? setting.userManagement.serviceAPI
                  : '',
                isNotLocal ? Validators.required : null,
              ],
              attributesMapping: this.formBuilder.array(
                setting &&
                  setting.userManagement &&
                  setting.userManagement.attributesMapping
                  ? setting.userManagement.attributesMapping.map(
                      createFormGroup
                    )
                  : []
              ),
            }),
          });
          // Subscribe to the form to update validators
          this.settingForm
            .get('userManagement.local')
            ?.valueChanges.subscribe((value) => {
              if (value) {
                this.settingForm
                  .get('userManagement.apiConfiguration')
                  ?.setValue('');
                this.settingForm.get('userManagement.serviceAPI')?.setValue('');
                this.mappingForm.clear();
                this.mappingForm.clearValidators();
                this.settingForm
                  .get('userManagement.apiConfiguration')
                  ?.clearValidators();
                this.settingForm
                  .get('userManagement.serviceAPI')
                  ?.clearValidators();
                this.settingForm
                  .get('userManagement.apiConfiguration')
                  ?.updateValueAndValidity();
                this.settingForm
                  .get('userManagement.serviceAPI')
                  ?.updateValueAndValidity();
              } else {
                if (!this.apiConfigurationsQuery) {
                  this.initApiConfigurations();
                }
                this.settingForm
                  .get('userManagement.apiConfiguration')
                  ?.setValidators(Validators.required);
                this.settingForm
                  .get('userManagement.serviceAPI')
                  ?.setValidators(Validators.required);
                this.settingForm
                  .get('userManagement.apiConfiguration')
                  ?.updateValueAndValidity();
                this.settingForm
                  .get('userManagement.serviceAPI')
                  ?.updateValueAndValidity();
              }
            });
          this.loading = res.loading;
        }
      });
  }

  /**
   * Initialize apiConfigurations subscription in case we need to use the API dropdown.
   */
  private initApiConfigurations(): void {
    this.apiConfigurationsQuery =
      this.apollo.watchQuery<GetApiConfigurationsQueryResponse>({
        query: GET_API_CONFIGURATIONS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });

    this.apiConfigurations$ = this.apiConfigurations.asObservable();
    this.apiConfigurationsQuery.valueChanges.subscribe((res) => {
      const nodes = res.data.apiConfigurations.edges.map((x) => x.node);
      if (this.defaultApiConfiguration) {
        this.apiConfigurations.next([
          this.defaultApiConfiguration,
          ...nodes.filter((x) => x.id !== this.defaultApiConfiguration?.id),
        ]);
      } else {
        this.apiConfigurations.next(nodes);
      }
      this.apiPageInfo = res.data.apiConfigurations.pageInfo;
      this.apiConfigurationsLoading = res.loading;
    });
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenApiSelect(e: any): void {
    if (e && this.apiSelect) {
      const panel = this.apiSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadApiOnScroll(event)
      );
    }
  }

  /**
   * Fetches more API configurations on scroll.
   *
   * @param e scroll event.
   */
  private loadApiOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.apiConfigurationsLoading && this.apiPageInfo.hasNextPage) {
        this.apiConfigurationsLoading = true;
        this.apiConfigurationsQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.apiPageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              apiConfigurations: {
                edges: [
                  ...prev.apiConfigurations.edges,
                  ...fetchMoreResult.apiConfigurations.edges,
                ],
                pageInfo: fetchMoreResult.apiConfigurations.pageInfo,
                totalCount: fetchMoreResult.apiConfigurations.totalCount,
              },
            });
          },
        });
      }
    }
  }

  /**
   * Save settings in the DB.
   */
  onSave(): void {
    this.loading = true;
    const settingValue: Setting = this.settingForm.value;
    this.apollo
      .mutate<EditSettingMutationResponse>({
        mutation: EDIT_SETTING,
        variables: {
          userManagement: settingValue.userManagement,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectNotUpdated',
              {
                type: this.translateService.instant(
                  'components.users.advancedSettings.title'
                ),
                error: res.errors[0].message,
              }
            ),
            { error: true }
          );
        } else {
          this.snackBar.openSnackBar(
            this.translateService.instant(
              'common.notifications.objectUpdated',
              {
                value: this.translateService.instant(
                  'components.users.advancedSettings.title'
                ),
                type: '',
              }
            )
          );
          this.settingForm.markAsPristine();
          this.loading = res.data?.loading || false;
        }
      });
  }
}
