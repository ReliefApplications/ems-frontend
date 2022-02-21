import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'safe-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class SafeFieldDropdownComponent implements OnInit {
  @Input() fieldControl!: FormControl;
  @Input() fields: any[] = [];
  @Input() label?: any;
  @Input() none? = false;
  constructor() {}

  ngOnInit(): void {}
}
