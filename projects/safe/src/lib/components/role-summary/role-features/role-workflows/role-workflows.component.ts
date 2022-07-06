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
import { Apollo } from 'apollo-angular';
import {
  GetWorkflowStepsQueryResponse,
  GET_WORKFLOW_STEPS,
} from '../../graphql/queries';
import { Step } from '../../../../models/step.model';
import {
  EditStepAccessMutationResponse,
  EDIT_STEP_ACCESS,
} from '../../graphql/mutations';

/** Component for the workflows section of the roles features */
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

  public steps: Step[] = [];
  public accessibleSteps: string[] = [];

  @Output() edit = new EventEmitter();

  public displayedColumns = ['name', 'actions'];
  public openedWorkflowId = '';
  public accessiblePages: string[] = [];

  /**
   * Component for the workflows section of the roles features
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {}

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

  /**
   * Toggles the accordion for the clicled workflow and fetches its steps
   *
   * @param page The Page element for the workflow to be toggled
   */
  toggleWorkflow(page: Page): void {
    this.steps = [];
    if (page.id === this.openedWorkflowId) {
      this.openedWorkflowId = '';
    } else {
      this.openedWorkflowId = page.id as string;
      this.apollo
        .query<GetWorkflowStepsQueryResponse>({
          query: GET_WORKFLOW_STEPS,
          variables: {
            id: page.content,
          },
        })
        .subscribe((res) => {
          if (res.data) {
            this.steps = get(res.data.workflow, 'steps', []);
            this.accessibleSteps = this.steps
              .filter((x) =>
                get(x, 'permissions.canSee', [])
                  .map((y: any) => y.id)
                  .includes(this.role.id)
              )
              .map((x) => x.id as string);
          }
        });
    }
  }

  /**
   * Edits the permissions for a given workflow step
   *
   * @param step A step object
   */
  onEditStepAccess(step: Step): void {
    this.loading = true;
    let canSeePermissions = get(step, 'permissions.canSee', []).map(
      (x: any) => x.id as string
    );
    if (this.accessibleSteps.includes(step.id as string)) {
      canSeePermissions = canSeePermissions.filter(
        (x: string) => x !== this.role.id
      );
    } else {
      canSeePermissions = [...canSeePermissions, this.role.id];
    }

    this.apollo
      .mutate<EditStepAccessMutationResponse>({
        mutation: EDIT_STEP_ACCESS,
        variables: {
          id: step.id,
          permissions: {
            canSee: canSeePermissions,
          },
        },
      })
      .subscribe((res) => {
        if (res.data) {
          const index = this.steps.findIndex(
            (x) => x.id === res.data?.editStep.id
          );
          const steps = [...this.steps];
          steps[index] = res.data.editStep;
          this.steps = steps;
          this.accessibleSteps = this.steps
            .filter((x) =>
              get(x, 'permissions.canSee', [])
                .map((y: any) => y.id)
                .includes(this.role.id)
            )
            .map((x) => x.id as string);
        }
        this.loading = res.loading;
      });
  }
  /**
   * Emits an event with the changes in permission for a given workflow page
   *
   * @param page A dashboard page object
   */
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
