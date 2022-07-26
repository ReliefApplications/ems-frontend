import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'safe-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class SafeTabSortComponent implements OnInit {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];

  /**
   * Constructor for the sorting component
   */
  constructor() {}

  ngOnInit(): void {}
}
