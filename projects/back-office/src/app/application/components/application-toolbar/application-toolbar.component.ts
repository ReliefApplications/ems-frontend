import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, SafeApplicationService, SafeConfirmModalComponent } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit, OnDestroy {

  // === APPLICATION ===
  public application: Application | null = null;
  private applicationSubscription?: Subscription;

  public canPublish = false;

  constructor(
    private applicationService: SafeApplicationService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      this.application = application;
      this.canPublish = !!this.application && this.application.pages ? this.application.pages.length > 0 : false;
    });
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }

  onPublish(): void {
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

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
