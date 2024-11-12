import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ActionButton,
  ApplicationService,
  Form,
  FormQueryResponse,
  Page,
  PageQueryResponse,
  QuickActionsService,
  FormComponent as SharedFormComponent,
  Step,
  StepQueryResponse,
  UnsubscribeComponent,
  WorkflowService,
} from '@oort-front/shared';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  GET_PAGE_BY_ID,
  GET_SHORT_FORM_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';

/**
 * Form page in application.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends UnsubscribeComponent implements OnInit {
  /** Form component */
  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;

  /** Loading indicator */
  public loading = true;
  /** Current form id */
  public id = '';
  /** Current application id */
  public applicationId = '';
  /** Current form */
  public form?: Form;
  /** Is form completed */
  public completed = false;
  /** Should possibility to add new records be hidden */
  public hideNewRecord = false;
  /** Query subscription */
  public querySubscription?: Subscription;
  /** Can name be edited */
  public canEditName = false;
  /** Is name form active */
  public formActive = false;
  /** Application page form is part of ( if any ) */
  public page?: Page;
  /** Application step form is part of ( if any ) */
  public step?: Step;
  /** Is form part of workflow step */
  public isStep = false;
  /** Configured form quick actions */
  public actionButtons: ActionButton[] = [];

  /**
   * Form page in application
   *
   * @param applicationService Shared application service
   * @param workflowService Shared workflow service
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param translate Angular translate service
   * @param dialog CDK Dialog service
   * @param quickActionsService Quick action button service
   */
  constructor(
    private applicationService: ApplicationService,
    private workflowService: WorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private dialog: Dialog,
    private quickActionsService: QuickActionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      // If a query is already loading, cancel it
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      if (this.isStep) {
        this.querySubscription = this.apollo
          .query<StepQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap(({ data }) => {
              this.step = data.step;
              this.actionButtons = data.step.buttons as ActionButton[];
              return this.getFormQuery(this.step.content ?? '');
            })
          )
          .subscribe(({ data, loading }) => {
            this.handleFormQueryResponse(data, 'step');
            this.loading = loading;
          });
      } else {
        this.querySubscription = this.apollo
          .query<PageQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap(({ data }) => {
              this.page = data.page;
              this.actionButtons = data.page.buttons as ActionButton[];
              return this.getFormQuery(this.page.content ?? '');
            })
          )
          .subscribe(({ data, loading }) => {
            this.handleFormQueryResponse(data, 'page');
            this.loading = loading;
          });
      }
    });
  }

  /**
   * Returns query for the given id
   *
   * @param {string} id form id to query
   * @returns form query for the given id
   */
  private getFormQuery(id: string) {
    return this.apollo.query<FormQueryResponse>({
      query: GET_SHORT_FORM_BY_ID,
      variables: {
        id,
      },
    });
  }

  /**
   * Handle response for the form query
   *
   * @param {FormQueryResponse} data form query response data
   * @param from from where the form query is done
   */
  private handleFormQueryResponse(
    data: FormQueryResponse,
    from: 'step' | 'page'
  ) {
    this.form = data.form;
    this.canEditName = this.form?.canUpdate ?? false;
    this.applicationId =
      (from === 'step'
        ? this.step?.workflow?.page?.application?.id
        : this.page?.application?.id) ?? '';
  }

  /**
   * Toggle activation of form.
   */
  toggleFormActive(): void {
    if (this.step?.canUpdate || this.page?.canUpdate) {
      this.formActive = !this.formActive;
    }
  }

  /**
   * Update the name of the tab.
   *
   * @param {string} tabName new tab name
   */
  saveName(tabName: string): void {
    const currentName = this.page ? this.page.name : this.step?.name;
    if (tabName && tabName !== currentName) {
      if (this.isStep) {
        // If form is workflow step
        const callback = () => {
          this.step = { ...this.step, name: tabName };
        };
        this.workflowService.updateStepName(
          {
            id: this.id,
            name: tabName,
          },
          callback
        );
      } else {
        // If form is page
        const callback = () => {
          this.page = { ...this.page, name: tabName };
        };
        this.applicationService.updatePageName(
          {
            id: this.id,
            name: tabName,
          },
          callback
        );
      }
    }
  }

  /**
   * Complete form
   *
   * @param e completion event
   * @param e.completed is completed
   * @param e.hideNewRecord do we show new record button
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  /**
   * Clear status of the form.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }

  /**
   * Edit form. Open form builder.
   */
  editForm(): void {
    if (this.isStep && this.step) {
      this.router.navigate([`./builder/${this.step.content}`], {
        relativeTo: this.route,
      });
    } else {
      if (this.page) {
        this.router.navigate([`./builder/${this.page.content}`], {
          relativeTo: this.route,
        });
      }
    }
  }

  /**
   * Open settings modal.
   */
  public async onOpenSettings(): Promise<void> {
    const { ViewSettingsModalComponent } = await import(
      '../../../components/view-settings-modal/view-settings-modal.component'
    );
    const dialogRef = this.dialog.open(ViewSettingsModalComponent, {
      data: {
        type: this.isStep ? 'step' : 'page',
        applicationId: this.applicationId,
        page: this.isStep ? undefined : this.page,
        step: this.isStep ? this.step : undefined,
        icon: this.isStep ? this.step?.icon : this.page?.icon,
        visible: this.page?.visible,
        showName: this.isStep ? this.step?.showName : this.page?.showName,
        accessData: {
          access: this.page
            ? this.page.permissions
            : this.step
            ? this.step.permissions
            : null,
          application: this.applicationId,
          objectTypeName: this.translate.instant(
            'common.' + this.isStep ? 'step' : 'page' + '.one'
          ),
        },
        canUpdate:
          !this.formActive &&
          (this.page
            ? this.page.canUpdate
            : this.step
            ? this.step.canUpdate
            : false),
      },
    });
    // Subscribes to settings updates
    const subscription = dialogRef.componentInstance?.onUpdate
      .pipe(takeUntil(this.destroy$))
      .subscribe((updates: any) => {
        if (updates) {
          if (this.isStep) {
            this.step = { ...this.step, ...updates };
          } else {
            this.page = { ...this.page, ...updates };
          }
          if (updates.permissions) {
            this.form = {
              ...this.form,
              ...updates,
            };
          }
        }
      });
    // Unsubscribe to dialog onUpdate event
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      subscription?.unsubscribe();
    });
  }

  /** Opens modal to modify button actions */
  public async onEditButtonActions() {
    const { EditActionButtonsModalComponent } = await import(
      '../../../components/edit-action-buttons-modal/edit-action-buttons-modal.component'
    );
    const dialogRef = this.dialog.open<ActionButton[] | undefined>(
      EditActionButtonsModalComponent,
      {
        data: {
          form: {
            ...(this.isStep && this.step),
            ...(!this.isStep && this.page),
            buttons: this.actionButtons,
          },
        },
        disableClose: true,
      }
    );
    dialogRef.closed
      .pipe(
        filter((buttons) => !!buttons),
        switchMap(
          (buttons) =>
            this.quickActionsService
              .savePageButtons(
                this.isStep ? this.step?.id : this.page?.id,
                buttons,
                'form',
                this.isStep
              )
              ?.pipe(
                map(({ errors }) => {
                  return {
                    errors,
                    buttons,
                  };
                })
              ) as Observable<any>
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ errors, buttons }) => {
        this.actionButtons = buttons as ActionButton[];
        if (this.isStep) {
          (this.step as Step).buttons = buttons;
        } else {
          (this.page as Page).buttons = buttons;
        }
        this.applicationService.handleEditionMutationResponse(
          errors,
          this.translate.instant('common.form.one')
        );
      });
  }
}
