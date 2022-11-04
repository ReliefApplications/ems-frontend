import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'safe-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class SafeTabSortComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;

  /**
   * Constructor for the sorting component
   */
  constructor() {}

  ngOnInit(): void {}
}
