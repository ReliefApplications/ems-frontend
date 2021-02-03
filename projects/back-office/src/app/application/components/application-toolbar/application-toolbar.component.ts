import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WhoApplicationService, WhoConfirmModalComponent } from '@who-ems/builder';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-application-toolbar',
  templateUrl: './application-toolbar.component.html',
  styleUrls: ['./application-toolbar.component.scss']
})
export class ApplicationToolbarComponent implements OnInit {

  constructor(
    private applicationService: WhoApplicationService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }

  onPublish(): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: `Publish application`,
        content: `Do you confirm publish application ?`,
        confirmText: 'Confirm',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applicationService.publish();
      }
    });

  }
}
