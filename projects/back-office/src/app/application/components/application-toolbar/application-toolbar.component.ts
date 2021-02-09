import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application, WhoApplicationService, WhoConfirmModalComponent } from '@who-ems/builder';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit, OnDestroy {

  // === APPLICATION ===
  public application: Application;
  private applicationSubscription: Subscription;

  public canPublish = false;

  constructor(
    private applicationService: WhoApplicationService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      this.application = application;
      this.canPublish = !!this.application && this.application.pages.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.applicationSubscription.unsubscribe();
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }

  onPublish(): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: `Publish application`,
        content: `Do you confirm the publication of ${this.application.name} ?`,
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
