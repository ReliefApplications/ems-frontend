import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Aggregation } from '../../../../../models/aggregation.model';

/**
 * Component used in the card-modal-settings for selecting the record data.
 */
@Component({
  selector: 'safe-value-selector-tab',
  templateUrl: './value-selector-tab.component.html',
  styleUrls: ['./value-selector-tab.component.scss'],
})
export class SafeValueSelectorTabComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() settings: any;
  @Input() resourceId!: string;
  @Input() aggregation?: Aggregation;
  @Input() sourceType!: 'layout' | 'aggregation';

  public selectedRows: string[] = [];

  /**
   * Gets the selected row if one is already selected.
   */
  ngOnInit(): void {
    if (this.form.value.record) {
      this.selectedRows = [this.form.value.record];
    }
  }

  /**
   * Updates the selected record when the selected row is changed.
   *
   * @param event selection event
   */
  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      this.form.patchValue({ record: event.selectedRows[0].dataItem.id });
    } else {
      this.form.patchValue({ record: null });
    }
  }
}
