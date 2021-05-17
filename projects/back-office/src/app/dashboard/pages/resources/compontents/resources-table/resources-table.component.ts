import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Application, Form } from '@safe/builder';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-resources-table',
  templateUrl: './resources-table.component.html',
  styleUrls: ['./resources-table.component.scss']
})
export class ResourcesTableComponent implements OnInit {

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

  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];

  constructor() {}

  ngOnInit(): void {}

}
