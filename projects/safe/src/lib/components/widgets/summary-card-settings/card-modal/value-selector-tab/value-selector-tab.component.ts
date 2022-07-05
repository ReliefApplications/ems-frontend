import { Component, OnInit, Input } from '@angular/core';
import { SafeGridLayoutService } from '../../../../../services/grid-layout.service';

@Component({
  selector: 'safe-value-selector-tab',
  templateUrl: './value-selector-tab.component.html',
  styleUrls: ['./value-selector-tab.component.scss']
})
export class SafeValueSelectorTabComponent implements OnInit {

  @Input() form: any;

  public selectedRows = [];
  public settings: any = null;

  constructor() { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((value: any) => {
      if (this.settings != this.findLayout(value.dataset.layouts, value.layout[0])) {
        this.settings = this.findLayout(value.dataset.layouts, value.layout[0]);
      }
    })
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
    this.form.patchValue({record: event.selectedRows[0].dataItem.id});
  }

}
