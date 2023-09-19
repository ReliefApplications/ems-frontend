import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Application,
  SafeApplicationService,
  SafeConfirmService,
  SafeUnsubscribeComponent,
  SafeLayoutService,
} from '@oort-front/safe';
import { Dialog } from '@angular/cdk/dialog';
import {
  DeleteApplicationMutationResponse,
  DELETE_APPLICATION,
} from './graphql/mutations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { CustomStyleComponent } from '../../../components/custom-style/custom-style.component';
import { SnackbarService } from '@oort-front/ui';

/**
 * Application settings page component.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public applications = new Array<Application>();
  public settingsForm!: ReturnType<typeof this.createSettingsForm>;
  public application?: Application;
  public user: any;
  public locked: boolean | undefined = undefined;
  public lockedByUser: boolean | undefined = undefined;

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
   * @param layoutService Shared layout service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snackBar: SnackbarService,
    private applicationService: SafeApplicationService,
    private confirmService: SafeConfirmService,
    public dialog: Dialog,
    private translate: TranslateService,
    private layoutService: SafeLayoutService
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
    return this.fb.group({
      id: [{ value: application.id, disabled: true }],
      name: [application.name, Validators.required],
      sideMenu: [application.sideMenu],
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
                next: ({ errors, data }) => {
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
                    this.applications = this.applications.filter(
                      (x) => x.id !== data?.deleteApplication.id
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
}
