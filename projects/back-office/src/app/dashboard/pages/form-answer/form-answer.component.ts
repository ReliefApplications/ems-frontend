import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Form, SafeBreadcrumbService, SafeFormComponent } from '@safe/builder';
import {
  GetFormByIdQueryResponse,
  GET_SHORT_FORM_BY_ID,
} from './graphql/queries';

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

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private breadcrumbService: SafeBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.apollo
        .watchQuery<GetFormByIdQueryResponse>({
          query: GET_SHORT_FORM_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe((res) => {
          this.loading = res.loading;
          this.form = res.data.form;
          this.breadcrumbService.setBreadcrumb(
            '@form',
            this.form.name as string
          );
        });
    }
  }

  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
  }

  clearForm(): void {
    this.formComponent?.reset();
  }
}
