import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryBuilderService } from '../../services/query-builder.service';
import { FormGroup } from '@angular/forms';
import { PopupService } from '@progress/kendo-angular-popup';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

interface DialogData {
  form: any;
  resourceName: string;
}

@Component({
  selector: 'safe-config-display-grid-fields-modal',
  templateUrl: './config-display-grid-fields-modal.component.html',
  styleUrls: ['./config-display-grid-fields-modal.component.css'],
  providers: [
    PopupService,
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_TOOLTIP_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class ConfigDisplayGridFieldsModalComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public loading = true;

  @ViewChild('settingsContainer', { read: ViewContainerRef }) settingsContainer: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private queryBuilder: QueryBuilderService) {
  }

  ngOnInit(): void {
    this.queryBuilder.availableQueries.subscribe((res) => {
      console.log(res);
      if (res.length > 0) {
        const hasDataForm = this.data.form !== null;
        const queryName = hasDataForm ? this.data.form.value.name : this.queryBuilder.getQueryNameFromResourceName(this.data.resourceName);
        this.form = this.queryBuilder.createQueryForm({
          name: queryName,
          fields: hasDataForm ? this.data.form.value.fields : [],
          sort: hasDataForm ? this.data.form.value.sort : {},
          filter: hasDataForm ? this.data.form.value.filter : {}
        });
        console.log(this.form);
        this.loading = false;
      }
    });
  }

}
