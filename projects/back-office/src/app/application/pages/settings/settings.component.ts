import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Application, WhoApplicationService, WhoConfirmModalComponent, WhoSnackBarService } from '@who-ems/builder';
import { MatDialog} from '@angular/material/dialog';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION } from '../../../graphql/mutations';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';
import { Apollo } from 'apollo-angular';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {


  public applications = new MatTableDataSource<Application>([]);
  public settingsForm: FormGroup;
  private applicationSubscription: Subscription;
  public application: Application;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private applicationService: WhoApplicationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application){
        this.application = application;
        this.settingsForm = this.formBuilder.group(
          {
            id: [{ value: application.id, disabled: true }],
            name: [application.name, Validators.required],
            description: [application.description]
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    this.applicationService.editApplication(this.settingsForm.value);
    this.settingsForm.markAsPristine();
  }

  onDuplicate(): void {
    this.dialog.open(DuplicateApplicationComponent, {
      data: {
        id: this.application.id,
        name: this.application.name
      }
    });
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: 'Delete application',
        content: `Do you confirm the deletion of this application ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = this.application.id;
        this.apollo.mutate<DeleteApplicationMutationResponse>({
          mutation: DELETE_APPLICATION,
          variables: {
            id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar('Application deleted', { duration: 1000 });
          this.applications.data = this.applications.data.filter(x => {
            return x.id !== res.data.deleteApplication.id;
          });
        });
        this.router.navigate(['/applications']);
      }
    });
  }
}
