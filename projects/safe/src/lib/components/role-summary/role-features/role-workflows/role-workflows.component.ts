import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../../../models/page.model';

@Component({
  selector: 'safe-role-workflows',
  templateUrl: './role-workflows.component.html',
  styleUrls: ['./role-workflows.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RoleWorkflowsComponent implements OnInit {
  @Input() pages: Page[] = [];
  public displayedColumns = ['name', 'actions'];
  public openedWorkflowId = '';

  constructor() {}

  ngOnInit(): void {}

  toggleWorkflow(id: string): void {
    if (id === this.openedWorkflowId) {
      this.openedWorkflowId = '';
    } else {
      this.openedWorkflowId = id;
    }
  }
}
