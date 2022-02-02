import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, Record } from '@safe/builder';

@Component({
  selector: 'app-resource-records',
  templateUrl: './resource-records.component.html',
  styleUrls: ['./resource-records.component.scss'],
})
export class ResourceRecordsComponent implements OnInit {
  @Input() records: any[] = [];
  @Input() columns: string[] = [];
  @Input() forms: Form[] = [];
  @Input() pageInfo: any;
  @Output() page = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Get list of forms filtering by record form.
   *
   * @param record Record to filter templates with.
   * @returns list of different forms than the one used to create the record.
   */
  public filterTemplates(record: Record): Form[] {
    return this.forms.filter((x: Form) => x.id !== record.form?.id);
  }
}
