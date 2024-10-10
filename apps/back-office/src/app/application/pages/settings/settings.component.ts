import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
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
  ApplicationsApplicationNodesQueryResponse,
  ApplicationService,
  ConfirmService,
  DeleteApplicationMutationResponse,
  status,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { iif, of, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { CustomStyleComponent } from '../../../components/custom-style/custom-style.component';
import { DELETE_APPLICATION } from './graphql/mutations';
import { GET_APPLICATION_WITH_SHORTCUT } from './graphql/queries';

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
  /** Current form values subscription */
  private formSubscription!: Subscription;

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
    private layoutService: UILayoutService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
          this.settingsForm = this.createSettingsForm(application);
          this.updateCurrentFormSubscriptionListener();
          this.locked = this.application?.locked;
          this.lockedByUser = this.application?.lockedByUser;
        }
      });
  }

  /**
   * Update current form subscription listeners
   */
  private updateCurrentFormSubscriptionListener() {
    this.formSubscription?.unsubscribe();
    this.formSubscription = this.settingsForm
      .get('shortcut')
      ?.valueChanges.pipe(
        debounceTime(1000),
        switchMap((shortcut: string | undefined | null) => {
          return iif(
            () => (shortcut as string).length >= 2,
            (async () => {
              await this.existsApplicationWithShortcutQuery(
                shortcut as string
              ).refetch();
              return this.existsApplicationWithShortcutQuery(
                shortcut as string
              ).valueChanges.pipe(
                map((data) => {
                  return data.data.applications.edges.length;
                })
              );
            })(),
            of(null)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.settingsForm.get('shortcut')?.setErrors({ isNotUnique: true });
          } else {
            this.settingsForm.get('shortcut')?.setErrors(null);
          }
        },
      }) as Subscription;
  }

  /**
   * Create Settings form
   *
   * @param application Current application
   * @returns form group
   */
  private createSettingsForm(application: Application) {
    return this.fb.group({
      id: [{ value: application.id, disabled: true }],
      name: [application.name, Validators.required],
      shortcut: [application.shortcut, shortcutValidator],
      sideMenu: [application.sideMenu],
      hideMenu: [application.hideMenu],
      description: [application.description],
      status: [application.status],
    });
  }

  /**
   * Submit settings form.
   */
  onSubmit(): void {
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

  /**
   * Check if an application exists with the given shortcut
   *
   * @param shortcut Shortcut to check
   * @returns query
   */
  private existsApplicationWithShortcutQuery(shortcut: string) {
    return this.apollo.watchQuery<ApplicationsApplicationNodesQueryResponse>({
      query: GET_APPLICATION_WITH_SHORTCUT,
      variables: {
        filter: {
          logic: 'and',
          filters: [
            {
              field: 'shortcut',
              operator: 'eq',
              value: shortcut,
            },
            {
              field: 'id',
              operator: 'neq',
              value: this.application?.id,
            },
          ],
        },
      },
    });
  }
}
