import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Application, WhoSnackBarService } from 'who-shared';
import { GetApplicationByIdQueryResponse, GET_APPLICATION_BY_ID } from '../../../graphql/queries';
import { EditApplicationMutationResponse, EDIT_APPLICATION } from '../../../graphql/mutations';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public application: Application;

  // === APPLICATION NAME EDITION ===
  public formActive: boolean;
  public applicationNameForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.params.id;
    this.apollo.watchQuery<GetApplicationByIdQueryResponse>({
      query: GET_APPLICATION_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.application) {
        this.application = res.data.application;
        this.applicationNameForm = new FormGroup({
          applicationName: new FormControl(this.application.name, Validators.required)
        });
        this.loading = res.loading;
      } else {
        this.snackBar.openSnackBar('No access provided to this application.', { error: true });
        this.router.navigate(['/applications']);
      }
    },
      (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      }
    );
  }

  toggleFormActive = () => this.formActive = !this.formActive;
  
  /*  Update the name of the application.
  */
  saveName(): void {
    const { applicationName } = this.applicationNameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: this.id,
        name: applicationName
      }
    }).subscribe(res => {
      this.application.name = res.data.editApplication.name;
    });
  }

}
