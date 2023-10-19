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
import { GET_WORKFLOW_STEPS } from '../../graphql/queries';
import { EditStepMutationResponse, Step } from '../../../../models/step.model';
import { WorkflowQueryResponse } from '../../../../models/workflow.model';
import { EDIT_STEP_ACCESS } from '../../graphql/mutations';
import { SnackbarService } from '@oort-front/ui';

/** Component for the workflows section of the roles features */
@Component({
  selector: 'shared-role-workflows',
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
  @Input() search = '';

  public steps: Step[] = [];
  public filteredSteps = this.steps;
  public accessibleSteps: string[] = [];
  @Output() edit = new EventEmitter();

  public displayedColumns = ['name', 'actions'];
  public openedWorkflowId = '';
  public accessiblePages: string[] = [];
  public filteredPages = this.pages;

  /**
   * Component for the workflows section of the roles features
   *
   * @param apollo Apollo service
   * @param snackBar Shared snackbar service
   */
  constructor(private apollo: Apollo, private snackBar: SnackbarService) {}

  ngOnInit(): void {
    this.accessiblePages = this.getAccessibleElementIds(this.filteredPages);
  }

  ngOnChanges(): void {
    this.filteredSteps = this.steps.filter((x) =>
      x.name?.toLowerCase().includes(this.search)
    );

    // shows workflows that don't match the search if one of its steps does
    this.filteredPages = this.pages.filter(
      (x) =>
        x.name?.toLowerCase().includes(this.search) || this.filteredSteps.length
    );
    this.accessiblePages = this.getAccessibleElementIds(this.filteredPages);
  }

  /**
   *Returns the page ids that can be access by the current role
   *
   * @param filteredElements Elements to check if can be access by the current role
   * @returns ids of the elements that can be access by the current role
   */
  private getAccessibleElementIds(
    filteredElements: Array<Page | Step>
  ): string[] {
    return filteredElements
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
    this.filteredSteps = [];
    if (page.id === this.openedWorkflowId) {
      this.openedWorkflowId = '';
    } else {
      this.openedWorkflowId = page.id as string;
      this.apollo
        .query<WorkflowQueryResponse>({
          query: GET_WORKFLOW_STEPS,
          variables: {
            id: page.content,
          },
        })
        .subscribe({
          next: ({ data }) => {
            if (data) {
              this.steps = get(data.workflow, 'steps', []);
              this.filteredSteps = this.steps.filter((x) =>
                x.name?.toLowerCase().includes(this.search)
              );
              this.accessibleSteps = this.getAccessibleElementIds(
                this.filteredSteps
              );
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
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
    const hasAccess = this.accessibleSteps.includes(step.id as string);

    this.apollo
      .mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP_ACCESS,
        variables: {
          id: step.id,
          permissions: {
            canSee: { [hasAccess ? 'remove' : 'add']: [this.role.id] },
          },
        },
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            const index = this.steps.findIndex(
              (x) => x.id === data?.editStep.id
            );
            const steps = [...this.steps];
            steps[index] = data.editStep;
            this.steps = steps;
            this.filteredSteps = this.steps.filter((x) =>
              x.name?.toLowerCase().includes(this.search)
            );
            this.accessibleSteps = this.getAccessibleElementIds(this.steps);
          }
          this.loading = loading;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Emits an event with the changes in permission for a given workflow page
   *
   * @param page A dashboard page object
   */
  onEditAccess(page: Page): void {
    const hasAccess = this.accessiblePages.includes(page.id as string);
    this.edit.emit({
      page: page.id,
      action: { [hasAccess ? 'remove' : 'add']: [this.role.id] },
    });
  }
}
