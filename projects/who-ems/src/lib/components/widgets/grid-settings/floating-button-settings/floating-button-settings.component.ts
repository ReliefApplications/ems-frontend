import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'who-floating-button-settings',
  templateUrl: './floating-button-settings.component.html',
  styleUrls: ['./floating-button-settings.component.scss']
})
export class FloatingButtonSettingsComponent implements OnInit {

  @Input() buttonForm: FormGroup;
  @Input() fields: any[];

  constructor() { }

  ngOnInit(): void {
  }

  compareFields(field1: any, field2: any): boolean {
    return field1.name === field2.name;
  }

}
