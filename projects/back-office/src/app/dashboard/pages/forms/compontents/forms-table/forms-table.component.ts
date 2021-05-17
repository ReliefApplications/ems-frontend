import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, Form } from '@safe/builder';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-forms-table',
  templateUrl: './forms-table.component.html',
  styleUrls: ['./forms-table.component.scss']
})
export class FormsTableComponent implements OnInit {

  @Input()
  dataSource: MatTableDataSource<Form> = new MatTableDataSource<Form>([]);

  @Input()
  loading = true;

  @Input()
  loadMoreData = false;

  @Input()
  noMoreData = false;

  @Output()
  sortTable: EventEmitter<Sort> = new EventEmitter<Sort>();

  @Output()
  delete: EventEmitter<Application> = new EventEmitter<Application>();

  @Output()
  save: EventEmitter<{ permission: object, application: Application }> =
    new EventEmitter<{ permission: object, application: Application }>();

  // === SORTING ===
  sortActive = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  public displayedColumns = ['name', 'createdAt', 'status', 'versionsCount', 'recordsCount', 'core', 'actions'];

  constructor() {}

  ngOnInit(): void {}

}
