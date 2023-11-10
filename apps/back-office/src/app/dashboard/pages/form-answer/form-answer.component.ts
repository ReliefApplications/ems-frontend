import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  Form,
  FormQueryResponse,
  SafeBreadcrumbService,
  SafeFormComponent,
} from '@oort-front/safe';
import { GET_SHORT_FORM_BY_ID } from './graphql/queries';

/**
 * Form answer page component.
 */
@Component({
  selector: 'app-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrls: ['./form-answer.component.scss'],
})
export class FormAnswerComponent implements OnInit {
  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

  // === DATA ===
  public loading = true;
  public id = '';
  public form?: Form;
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
    private breadcrumbService: SafeBreadcrumbService
  ) {}

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
        .valueChanges.subscribe(({ data, loading }) => {
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
