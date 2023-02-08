import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite filter component.
 */
@Component({
  selector: 'safe-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class SafeFilterComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];

  ngOnInit(): void {}
}
