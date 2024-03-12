import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Form,
  FormQueryResponse,
  BreadcrumbService,
  FormComponent,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { GET_SHORT_FORM_BY_ID } from './graphql/queries';
import { takeUntil } from 'rxjs';

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

  /**
   * Form answer page component.
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    super();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.apollo
        .watchQuery<FormQueryResponse>({
          query: GET_SHORT_FORM_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, loading }) => {
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
          },
          error: () => {
            this.loading = false;
          },
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
