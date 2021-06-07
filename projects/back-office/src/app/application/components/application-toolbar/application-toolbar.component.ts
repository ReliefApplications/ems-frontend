import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, NOTIFICATIONS, SafeApplicationService, SafeAuthService, SafeConfirmModalComponent, SafeSnackBarService } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EditApplicationMutationResponse, EDIT_APPLICATION } from '../../../graphql/mutations';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit, OnDestroy {

  // === APPLICATION ===
  public application: Application | null = null;
  private authSubscription?: Subscription;
  private applicationSubscription?: Subscription;
  public isLocked: boolean  | undefined = undefined;
  public isLockedByActualUser: boolean | undefined = undefined;
  public canPublish = false;
  public user: any;

  constructor(
    private applicationService: SafeApplicationService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.user = { ...user};
      }
    });
    console.log("this user = ", this.user);
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      this.application = application;
      console.log("this application = ", this.application);
      this.isLocked = this.application?.isLocked;
      if (this.isLocked) {
        if (this.user.id === this.application?.isLockedBy?.id) {
          this.isLockedByActualUser = true;
        } else {
          this.isLockedByActualUser = false;
        }
      }
      this.canPublish = !!this.application && this.application.pages ? this.application.pages.length > 0 : false;
    });
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }

  onLock(): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: (this.isLocked ? 'Unlock' : 'Lock') + ' edition',
        content: `Do you want to ` + (this.isLocked ? 'unlock' : 'lock') + ` ${this.application?.name}'s edition ?`,
        confirmText: 'Confirm',
        confirmColor: 'primary'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditApplicationMutationResponse>(
          {
            mutation: EDIT_APPLICATION,
            variables: {
              id: this.application?.id,
              name: this.application?.name,
              isLocked: (this.isLocked ? !this.isLocked : true),
              isLockedBy: (!this.isLocked ? this.user.id : null),
            }
          }).subscribe(res => {
            if (res.data) {
              this.isLocked = res.data.editApplication.isLocked;
              if (this.user.id === res.data.editApplication.isLockedBy?.id && this.isLocked) {
                this.isLockedByActualUser = true;
              } else {
                this.isLockedByActualUser = this.isLocked ? true : false;
              }
            }
        });
      }
    });
  }

  onPublish(): void {
    if (this.isLocked) {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectIsLocked(this.application?.name));
    } else {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: `Publish application`,
          content: `Do you confirm the publication of ${this.application?.name} ?`,
          confirmText: 'Confirm',
          confirmColor: 'primary'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.applicationService.publish();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
