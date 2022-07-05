import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  SafeSnackBarService,
  Setting,
  createFormGroup,
  SafeAuthService,
  Permissions,
} from '@safe/builder';
import {
  GetSettingQueryResponse,
  GET_SETTING,
} from '../../../../graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import {
  EditSettingMutationResponse,
  EDIT_SETTING,
} from '../../../../graphql/mutations';

/**
 * Advanced user settings component.
 */
@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss'],
})
export class AdvancedSettingsComponent implements OnInit {
  settingForm: FormGroup = new FormGroup({});
  loading = true;

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
   * @param authService Safe authentication service
   */
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translateService: TranslateService,
    private authService: SafeAuthService
  ) {}

  ngOnInit(): void {
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
          const setting = res.data.setting;
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
              serviceAPI: [
                setting &&
                setting.userManagement &&
                setting.userManagement.serviceAPI
                  ? setting.userManagement.serviceAPI
                  : '',
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
          this.settingForm
            .get('userManagement.local')
            ?.valueChanges.subscribe((value) => {
              if (value) {
                this.settingForm.get('userManagement.serviceAPI')?.setValue('');
                this.mappingForm.clear();
              }
            });
          this.loading = res.loading;
        }
      });
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
