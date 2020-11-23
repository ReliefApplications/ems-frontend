import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Input() data: any;

  public settingsForm: FormBuilder;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
      name: [''],
      description: ['']
    });
  }

  onSubmit(): void {}
}
