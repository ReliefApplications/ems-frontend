import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContentType, Form, Permissions, WhoAuthService, WhoSnackBarService } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AddFormComponent } from '../../../components/add-form/add-form.component';
import { AddFormMutationResponse, ADD_FORM } from '../../../graphql/mutations';
import { GetFormsQueryResponse, GET_FORMS } from '../../../graphql/queries';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

  // === DATA ===
  public contentTypes = Object.keys(ContentType);
  public forms: Form[];

  // === REACTIVE FORM ===
  public pageForm: FormGroup;
  public showContent = false;
  public step = 1;

  // === PERMISSIONS ===
  canCreateForm = false;
  private authSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.pageForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      content: [''],
      newForm: [false]
    });
    this.pageForm.get('type').valueChanges.subscribe(type => {
      const contentControl = this.pageForm.controls.content;
      if (type === ContentType.form) {
        this.apollo.watchQuery<GetFormsQueryResponse>({
          query: GET_FORMS,
        }).valueChanges.subscribe((res) => {
          this.forms = res.data.forms;
          contentControl.setValidators([Validators.required]);
          contentControl.updateValueAndValidity();
          this.showContent = true;
        });
      } else {
        contentControl.setValidators(null);
        contentControl.setValue(null);
        contentControl.updateValueAndValidity();
        this.showContent = false;
      }
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canCreateForm = this.authService.userHasClaim(Permissions.canManageForms);
    });
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1: {
        return this.pageForm.controls.name.valid;
      }
      case 2: {
        return this.pageForm.controls.type.valid;
      }
      case 3: {
        return this.pageForm.controls.content.valid;
      }
      default: {
        return true;
      }
    }
  }

  onSubmit(): void {
    this.applicationService.addPage(this.pageForm.value);
  }

  onBack(): void {
    this.step -= 1;
  }

  onNext(): void {
    switch (this.step) {
      case 1: {
        this.step += 1;
        break;
      }
      case 2: {
        this.pageForm.controls.type.value === ContentType.form ? this.step += 1 : this.onSubmit();
        break;
      }
      case 3: {
        this.onSubmit();
        break;
      }
      default: {
        this.step += 1;
        break;
      }
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      panelClass: 'add-dialog'
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const data = { name: value.name };
        Object.assign(data,
          value.binding === 'newResource' && { newResource: true },
          (value.binding === 'fromResource' && value.resource) && { resource: value.resource }
        );
        this.apollo.mutate<AddFormMutationResponse>({
          mutation: ADD_FORM,
          variables: data
        }).subscribe(res => {
          const { id } = res.data.addForm;
          this.pageForm.controls.content.setValue(id);
          this.onSubmit();
        }, (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        });
      }
    });
  }
}
