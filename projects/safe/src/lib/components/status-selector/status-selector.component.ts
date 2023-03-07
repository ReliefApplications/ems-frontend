import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'safe-status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.scss'],
})
export class StatusSelectorComponent implements OnInit {
  public status;
  public hovering = false;
  public editing = false;
  public statusList = [
    { name: 'Active', status: 'active' },
    { name: 'Pending', status: 'pending' },
    { name: 'Archived', status: 'archived' },
  ];
  public statusChoices: { [key: string]: { name: string; status: string } } = {
    active: { name: 'Active', status: 'active' },
    pending: { name: 'Pending', status: 'pending' },
    archived: { name: 'Archived', status: 'archived' },
  };

  @Input()
  public option!: string;
  @Output()
  public selectionChange = new EventEmitter<string>();

  constructor() {
    this.status = this.statusChoices[this.option];
  }

  ngOnInit(): void {}

  onHover(): void {
    this.hovering = !this.hovering;
  }
  onEdit(): void {
    this.editing = !this.editing;
  }
  onSelect(item: any): void {
    this.editing = false;
    this.status = {
      name: item.name,
      status: item.status,
    };
    this.selectionChange.emit(this.status.status);
  }
}
