import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Form,
  FormQueryResponse,
  BreadcrumbService,
  FormComponent,
  ButtonActionT,
  UnsubscribeComponent,
} from '@oort-front/shared';
import {
  GET_PAGE_BY_ID,
  GET_SHORT_FORM_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { lastValueFrom, takeUntil } from 'rxjs';

/**
 * Form answer page component.
 */
@Component({
  selector: 'app-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrls: ['./form-answer.component.scss'],
})
export class FormAnswerComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Reference to shared form component */
  @ViewChild(FormComponent)
  private formComponent?: FormComponent;
  /** Loading indicator */
  public loading = true;
  /** Current form id */
  public id = '';
  /** Current form */
  public form?: Form;
  /** Is form completed */
  public completed = false;
  /** Form button actions */
  public buttonActions: ButtonActionT[] = [];

  /**
   * Form answer page component.
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param breadcrumbService Shared breadcrumb service
   * @param router Angular router
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {
    super();
  }

  /**
   * Load any action buttons needed for the form
   */
  private async loadActionButtons() {
    const isStep = this.router.url.includes('/workflow/');
    const query = isStep ? GET_STEP_BY_ID : GET_PAGE_BY_ID;
    const { data } = (await lastValueFrom(
      this.apollo.query<any>({
        query,
        variables: {
          id: this.id,
        },
      })
    )) as { data: { step?: any; page?: any } };
    this.buttonActions = data[isStep ? 'step' : 'page']
      .buttons as ButtonActionT[];
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      await this.loadActionButtons();
      this.apollo
        .watchQuery<FormQueryResponse>({
          query: GET_SHORT_FORM_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          this.form = data.form;
          this.breadcrumbService.setBreadcrumb(
            '@form',
            this.form.name as string
          );
          this.breadcrumbService.setBreadcrumb(
            '@resource',
            this.form.resource?.name as string
          );
          // this.breadcrumbService.setResourceName();
        });
    }
  }

  /**
   * Handle completion of form
   *
   * @param e completion event
   * @param e.completed completion status
   * @param e.hideNewRecord does 'new record' appear ?
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
  }

  /**
   * Reset the form, removing answers.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
