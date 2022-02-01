import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resource-layouts',
  templateUrl: './resource-layouts.component.html',
  styleUrls: ['./resource-layouts.component.scss'],
})
export class ResourceLayoutsComponent implements OnInit {
  @Input() layouts: any[] = [];

  public columns: string[] = ['name', 'createdAt', '_actions'];
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
