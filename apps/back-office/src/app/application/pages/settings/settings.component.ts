import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  ApplicationService,
  ConfirmService,
  DeleteApplicationMutationResponse,
  getLanguageNativeName,
  status,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs/operators';
import { CustomStyleComponent } from '../../../components/custom-style/custom-style.component';
import { DELETE_APPLICATION } from './graphql/mutations';

/**
 * Validators for checking that given shortcut value is valid
 *
 * If value exists:
 * - Should have at least a length of 2
 * - Should only contain letters, numbers and hyphens
 *
 * @param control current shortcut control
 * @returns validator flag
 */
const shortcutValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.value) {
    const isValid = /^[a-zA-Z0-9-]{2,}$/im.test(control.value);
    if (isValid) {
      return null;
    } else {
      return {
        isNotValid: true,
      };
    }
  }
  return null;
};

/**
 * Application settings page component.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends UnsubscribeComponent implements OnInit {
  /** Application list */
  public applications = new Array<Application>();
  /** Application settings form */
  public settingsForm!: ReturnType<typeof this.createSettingsForm>;
  /** Status choices */
  public statusChoices = Object.values(status);
  /** Current application */
  public application?: Application;
  /** Current user */
  public user: any;
  /** Is application locked for edition */
  public locked: boolean | undefined = undefined;
  /** Is application locked for edition by current user */
  public lockedByUser: boolean | undefined = undefined;
  /**
   * Languages that can be picked as "additional languages" for the
   * application - every system language except the default one, which is
   * always available.
   */
  public availableLanguages: string[] = [];

  /** @returns native name getter, exposed for the template */
  public readonly getLanguageNativeName = getLanguageNativeName;

  /** @returns Application shortcut form field */
  get shortcut(): AbstractControl | null {
    return this.settingsForm.get('shortcut');
  }

  /**
   * Application settings page component.
   *
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param applicationService Shared application service
   * @param confirmService Shared confirm service
   * @param dialog Dialog service
   * @param translate Angular translate service
   * @param layoutService UI layout service
   * @param environment Environment in which the application runs
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snackBar: SnackbarService,
    private applicationService: ApplicationService,
    private confirmService: ConfirmService,
    public dialog: Dialog,
    private translate: TranslateService,
    private layoutService: UILayoutService,
    @Inject('environment') private environment: any
  ) {
    super();
    this.availableLanguages = (
      this.environment.availableLanguages ?? []
    ).filter((lang: string) => lang !== this.translate.defaultLang);
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          // Only (re)build the form when a different application is loaded,
          // not on every emission - editApplication() re-emits the current
          // application after each successful save, and rebuilding the form
          // then would wipe out any edit made in the meantime (and reset the
          // save button to disabled) if it landed while the user was already
          // typing the next change.
          const isNewApplication = this.application?.id !== application.id;
          this.application = application;
          if (!this.settingsForm || isNewApplication) {
            this.settingsForm = this.createSettingsForm(application);
          }
          this.locked = this.application?.locked;
          this.lockedByUser = this.application?.lockedByUser;
        }
      });
  }

  /**
   * Create Settings form
   *
   * @param application Current application
   * @returns form group
   */
  private createSettingsForm(application: Application) {
    const form = this.fb.group({
      id: [{ value: application.id, disabled: true }],
      name: [application.name, Validators.required],
      shortcut: [application.shortcut, shortcutValidator],
      sideMenu: [application.sideMenu],
      topMenu: [application.topMenu],
      hideMenu: [application.hideMenu],
      description: [application.description],
      status: [application.status],
      additionalLanguages: [application.additionalLanguages ?? []],
    });
    // Make sure top menu and side menu are mutually exclusive
    form.controls.sideMenu.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          form.controls.topMenu.setValue(false, { emitEvent: false });
        }
      });
    form.controls.topMenu.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          form.controls.sideMenu.setValue(false, { emitEvent: false });
          form.controls.hideMenu.setValue(false, { emitEvent: false });
        }
      });
    return form;
  }

  /**
   * Submit settings form.
   * If any additional language was removed, prompts a confirm modal first,
   * since that language will disappear from the front-office UI.
   */
  onSubmit(): void {
    const previousLanguages: string[] =
      this.application?.additionalLanguages ?? [];
    const newLanguages: string[] =
      this.settingsForm?.value.additionalLanguages ?? [];
    const removedLanguages = previousLanguages.filter(
      (lang) => !newLanguages.includes(lang)
    );
    if (removedLanguages.length > 0) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant(
          'pages.application.settings.additionalLanguages.confirmRemoval.title'
        ),
        content: this.translate.instant(
          'pages.application.settings.additionalLanguages.confirmRemoval.message',
          {
            languages: removedLanguages
              .map((lang) => this.getLanguageNativeName(lang))
              .join(', '),
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.saveSettings();
          }
        });
    } else {
      this.saveSettings();
    }
  }

  /**
   * Actually persists the settings form value.
   */
  private saveSettings(): void {
    this.applicationService.editApplication(this.settingsForm?.value);
    this.settingsForm?.markAsPristine();
  }

  /**
   * Duplicate application.
   */
  async onDuplicate(): Promise<void> {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectLocked', {
          name: this.application?.name,
        })
      );
    } else {
      const { DuplicateApplicationModalComponent } = await import(
        '../../../components/duplicate-application-modal/duplicate-application-modal.component'
      );
      this.dialog.open(DuplicateApplicationModalComponent, {
        data: {
          id: this.application?.id,
          name: this.application?.name,
        },
      });
    }
  }

  /**
   * Delete application.
   * Prompt modal to confirm.
   */
  onDelete(): void {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectLocked', {
          name: this.application?.name,
        })
      );
    } else {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.application.one'),
        }),
        content: this.translate.instant(
          'components.application.delete.confirmationMessage',
          { name: this.application?.name }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            const id = this.application?.id;
            this.apollo
              .mutate<DeleteApplicationMutationResponse>({
                mutation: DELETE_APPLICATION,
                variables: {
                  id,
                },
              })
              .subscribe({
                next: ({ errors }) => {
                  if (errors) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectNotDeleted',
                        {
                          value: this.translate.instant(
                            'common.application.one'
                          ),
                          error: errors ? errors[0].message : '',
                        }
                      ),
                      { error: true }
                    );
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectDeleted',
                        {
                          value: this.translate.instant(
                            'common.application.one'
                          ),
                        }
                      )
                    );
                  }
                },
                error: (err) => {
                  this.snackBar.openSnackBar(err.message, { error: true });
                },
              });
            this.router.navigate(['/applications']);
          }
        });
    }
  }

  /** Opens right sidenav with custom css editor */
  onOpenStyle(): void {
    this.layoutService.setRightSidenav({
      component: CustomStyleComponent,
    });
    this.layoutService.closeRightSidenav = false;
  }

  /**
   * Edit the permissions layer.
   *
   * @param e permissions.
   */
  saveAccess(e: any): void {
    this.applicationService.editPermissions(e);
  }
}
