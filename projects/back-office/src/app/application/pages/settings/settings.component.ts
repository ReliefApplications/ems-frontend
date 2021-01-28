import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Application, WhoApplicationService } from '@who-ems/builder';
import { MatDialog} from '@angular/material/dialog';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public settingsForm: FormGroup;
  private applicationSubscription: Subscription;
  private application: Application;

  constructor(
    private formBuilder: FormBuilder,
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
    this.applicationSubscription.unsubscribe();
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
}
