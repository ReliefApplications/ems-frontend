import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Pagination tab component for the query builder.
 * Not always visible.
 */
@Component({
  selector: 'safe-tab-pagination',
  templateUrl: './tab-pagination.component.html',
  styleUrls: ['./tab-pagination.component.scss'],
})
export class SafeTabPaginationComponent implements OnInit {
  @Input() form!: FormGroup;

  /**
   * Pagination tab component for the query builder.
   * Not always visible.
   */
  constructor() {}

  ngOnInit(): void {}
}
