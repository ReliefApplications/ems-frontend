import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Form,
  Page,
  Step,
  FormComponent as SharedFormComponent,
  ApplicationService,
  WorkflowService,
  UnsubscribeComponent,
  StepQueryResponse,
  FormQueryResponse,
  PageQueryResponse,
} from '@oort-front/shared';
import {
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';

/**
 * Form page in application.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends UnsubscribeComponent implements OnInit {
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
   */
  constructor(
    private applicationService: ApplicationService,
    private workflowService: WorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private dialog: Dialog
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
}
