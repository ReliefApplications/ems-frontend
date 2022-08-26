import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class SafeFilterComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() fields: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
