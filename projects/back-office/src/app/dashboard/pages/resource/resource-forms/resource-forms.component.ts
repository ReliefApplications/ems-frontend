import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resource-forms',
  templateUrl: './resource-forms.component.html',
  styleUrls: ['./resource-forms.component.scss'],
})
export class ResourceFormsComponent implements OnInit {
  @Input() forms: any[] = [];

  public columns: string[] = [
    'name',
    'createdAt',
    'status',
    'recordsCount',
    'core',
    '_actions',
  ];
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
