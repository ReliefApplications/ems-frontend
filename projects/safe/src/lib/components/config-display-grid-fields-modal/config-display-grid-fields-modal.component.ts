import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QueryBuilderService } from '../../services/query-builder.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'safe-config-display-grid-fields-modal',
  templateUrl: './config-display-grid-fields-modal.component.html',
  styleUrls: ['./config-display-grid-fields-modal.component.css']
})
export class ConfigDisplayGridFieldsModalComponent implements OnInit {

  public form: FormGroup = new FormGroup({});

  constructor(@Inject(MAT_DIALOG_DATA) public data: { form: any }, private queryBuilder: QueryBuilderService) {
  }

  ngOnInit(): void {
    const queryName = this.queryBuilder.getQueryNameFromResourceName('CoreForm');
    const hasDataForm = this.data.form.fields && this.data.form.fields.length > 0;
    this.form = this.queryBuilder.createQueryForm({name: queryName, fields: hasDataForm ? this.data.form.fields : []});
    console.log('** ConfigDisplayGridFieldsModalComponent form **', this.form);
  }
}
