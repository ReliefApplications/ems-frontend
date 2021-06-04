import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryBuilderService } from '../../services/query-builder.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-config-display-grid-fields-modal',
  templateUrl: './config-display-grid-fields-modal.component.html',
  styleUrls: ['./config-display-grid-fields-modal.component.css']
})
export class ConfigDisplayGridFieldsModalComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { form: any, resourceName: string }, private queryBuilder: QueryBuilderService) {
  }

  ngOnInit(): void {
    this.queryBuilder.availableQueries.subscribe((res) => {
      if (res) {
        console.log('CONFIG DATA', this.data.resourceName);
        const hasDataForm = this.data.form.fields && this.data.form.fields.length > 0;
        const queryName = hasDataForm ? this.data.form.name : this.queryBuilder.getQueryNameFromResourceName(this.data.resourceName);
        this.form = this.queryBuilder.createQueryForm({
          name: queryName,
          fields: hasDataForm ? this.data.form.fields : []
        });
        console.log('QUERY NAME', queryName);
        console.log('FORM', this.form);
        this.loading = false;
      }
    });
  }
}
