import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Role } from '../../../../models/user.model';
import { Page } from '../../../../models/page.model';
import { get } from 'lodash';

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
export class RoleWorkflowsComponent implements OnInit, OnChanges {
  @Input() role!: Role;
  @Input() pages: Page[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter();

  public displayedColumns = ['name', 'actions'];
  public openedWorkflowId = '';
  public accessiblePages: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.accessiblePages = this.pages
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  ngOnChanges(): void {
    this.accessiblePages = this.pages
      .filter((x) =>
        get(x, 'permissions.canSee', [])
          .map((y: any) => y.id)
          .includes(this.role.id)
      )
      .map((x) => x.id as string);
  }

  toggleWorkflow(id: string): void {
    if (id === this.openedWorkflowId) {
      this.openedWorkflowId = '';
    } else {
      this.openedWorkflowId = id;
    }
  }

  onEditAccess(page: Page): void {
    const canSeePermissions = get(page, 'permissions.canSee', []).map(
      (x: any) => x.id as string
    );
    if (this.accessiblePages.includes(page.id as string)) {
      this.edit.emit({
        page: page.id,
        permissions: canSeePermissions.filter(
          (x: string) => x !== this.role.id
        ),
      });
    } else {
      this.edit.emit({
        page: page.id,
        permissions: [...canSeePermissions, this.role.id],
      });
    }
  }
}
