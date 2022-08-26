import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';

@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() form: Form | null = null;
  @Input() resource: Resource | null = null;
  @Input() queries: any[] = [];
  @Input() templates: Form[] = [];

  constructor() {}

  ngOnInit(): void {}
}
