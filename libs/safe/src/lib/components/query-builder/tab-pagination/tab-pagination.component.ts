import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Variant } from '@oort-front/ui';

/**
 * Pagination tab component for the query builder.
 * Not always visible.
 */
@Component({
  selector: 'safe-tab-pagination',
  templateUrl: './tab-pagination.component.html',
  styleUrls: ['./tab-pagination.component.scss'],
})
export class SafeTabPaginationComponent {
  @Input() form!: UntypedFormGroup;

  // === ICON VARIANTS ===
  public colorVariant = Variant;
}
