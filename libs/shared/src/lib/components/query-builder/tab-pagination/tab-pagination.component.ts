import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Pagination tab component for the query builder.
 * Not always visible.
 */
@Component({
  selector: 'shared-tab-pagination',
  templateUrl: './tab-pagination.component.html',
  styleUrls: ['./tab-pagination.component.scss'],
})
export class TabPaginationComponent {
  @Input() form!: UntypedFormGroup;
}
