import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Field dropdown component.
 */
@Component({
  selector: 'safe-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class FieldDropdownComponent implements OnInit {
  @Input() fieldControl!: FormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() suffix = '';
  @Input() nullable = false;

  /**
   * Field dropdown component.
   */
  constructor() {}

  ngOnInit(): void {}
}
