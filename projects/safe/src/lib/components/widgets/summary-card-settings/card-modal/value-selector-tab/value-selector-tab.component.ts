import { Component, OnInit, Input } from '@angular/core';
import { SafeGridLayoutService } from '../../../../../services/grid-layout.service';

@Component({
  selector: 'safe-value-selector-tab',
  templateUrl: './value-selector-tab.component.html',
  styleUrls: ['./value-selector-tab.component.scss']
})
export class SafeValueSelectorTabComponent implements OnInit {

  @Input() form: any;

  public selectedRows: string[] = [];
  public settings: any = null;

  constructor() { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value: any) => {
      if (this.settings != this.findLayout(value.dataset.layouts, value.layout[0])) {
        this.settings = this.findLayout(value.dataset.layouts, value.layout[0]);
      }
    })
    if (this.form.get('record').value) {
      this.selectedRows = [this.form.get('record').value];
    }
    console.log(this.selectedRows);
  }

  private findLayout(layouts: any[], layoutToFind: string): any {
    let result = null;

    layouts.map((layout: any) => {
      if (layout.id === layoutToFind) {
        result = layout;
      }
    })

    return result;
  }

  onSelectionChange(event: any) {
    if (event.selectedRows.length > 0) {
      this.form.patchValue({record: event.selectedRows[0].dataItem.id});
    } else {
      this.form.patchValue({record: null});
    }
  }

}
