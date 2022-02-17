import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Layout } from '../../../../models/layout.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';
import { AddLayoutComponent } from '../add-layout/add-layout.component';

@Component({
  selector: 'safe-layouts-parameters',
  templateUrl: './layouts-parameters.component.html',
  styleUrls: ['./layouts-parameters.component.scss'],
})
export class LayoutsParametersComponent implements OnInit {
  @Input() resource: Resource | undefined;
  @Input() form: Form | undefined;
  @Input() ids: string[] = [];

  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  layouts: any[] = [];
  columns: string[] = ['name', 'createdAt', '_actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  public onAdd(): void {
    const dialogRef = this.dialog.open(AddLayoutComponent);
  }

  onEditLayout(layout: Layout): void {
    console.log(layout);
  }

  onDeleteLayout(layout: Layout): void {
    console.log(layout);
  }
}
