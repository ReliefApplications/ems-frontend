import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  Application,
  SafeApplicationService,
  SafeConfirmService,
  SafeSnackBarService,
  SafeAuthService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  DeleteApplicationMutationResponse,
  DELETE_APPLICATION,
} from './graphql/mutations';
import { DuplicateApplicationModalComponent } from '../../../components/duplicate-application-modal/duplicate-application-modal.component';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

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
  public applications = new MatTableDataSource<Application>([]);
  public settingsForm?: UntypedFormGroup;
  public application?: Application;
  public user: any;
  public locked: boolean | undefined = undefined;
  public lockedByUser: boolean | undefined = undefined;

  /**
   * Application settings page component.
   *
   * @param formBuilder Angular form builder
   * @param apollo Apollo service
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param applicationService Shared application service
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param dialog Material dialog service
   * @param translate Angular translate service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private applicationService: SafeApplicationService,
    private authService: SafeAuthService,
    private confirmService: SafeConfirmService,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.application = application;
          this.settingsForm = this.formBuilder.group({
            id: [{ value: application.id, disabled: true }],
            name: [application.name, Validators.required],
            description: [application.description],
            status: [application.status],
          });
          this.locked = this.application?.locked;
          this.lockedByUser = this.application?.lockedByUser;
        }
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
  onDuplicate(): void {
    if (this.locked && !this.lockedByUser) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectLocked', {
          name: this.application?.name,
        })
      );
    } else {
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
        confirmColor: 'warn',
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          const id = this.application?.id;
          this.apollo
            .mutate<DeleteApplicationMutationResponse>({
              mutation: DELETE_APPLICATION,
              variables: {
                id,
              },
            })
            .subscribe(({ data }) => {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.application.one'),
                })
              );
              this.applications.data = this.applications.data.filter(
                (x) => x.id !== data?.deleteApplication.id
              );
            });
          this.router.navigate(['/applications']);
        }
      });
    }
  }
}
