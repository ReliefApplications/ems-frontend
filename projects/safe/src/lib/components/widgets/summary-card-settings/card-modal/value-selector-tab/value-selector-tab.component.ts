import { Component, OnInit, Input } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'safe-value-selector-tab',
  templateUrl: './value-selector-tab.component.html',
  styleUrls: ['./value-selector-tab.component.scss'],
})
export class SafeValueSelectorTabComponent implements OnInit {
  @Input() form: any;
  @Input() settings: any;

  public selectedRows: string[] = [];

  /**
   *
   */
  constructor() {}

  ngOnInit(): void {
    // this.form.controls.layout.valueChanges.subscribe((value: any) => {
    //   this.settings = this.findLayout(this.dataset, value[0]);
    // })
    if (this.form.get('record').value) {
      this.selectedRows = [this.form.get('record').value];
    }
  }

  /**
   *
   * @param event
   */
  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      this.form.patchValue({ record: event.selectedRows[0].dataItem.id });
    } else {
      this.form.patchValue({ record: null });
    }
  }
}
