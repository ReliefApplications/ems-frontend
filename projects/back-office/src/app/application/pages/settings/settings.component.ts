import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { Subscription } from 'rxjs';
import { Application } from '@who-ems/builder';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() data: any;

  public settingsForm: FormGroup;
  private applicationSubscription: Subscription;
  private id: string;

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
      name: [''],
      description: ['']
    });

    this.applicationSubscription = this.applicationService.application.subscribe((application: Application) => {
      if (application){
        this.id = application.id;
        const {name, description} = application;
        this.settingsForm.get('name').setValue(name);
        this.settingsForm.get('description').setValue(description);
      }
    })
  }

  onSubmit(): void {
    this.applicationService.editApplication(this.id, this.settingsForm.value);
  }
}
