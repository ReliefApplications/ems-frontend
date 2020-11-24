import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { Subscription } from 'rxjs';
import { Application } from '@who-ems/builder';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public settingsForm: FormGroup;
  private applicationSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application){
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
}
