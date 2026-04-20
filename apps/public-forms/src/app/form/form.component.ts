import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import {
  FormQueryResponse,
} from '@oort-front/shared';
import {
  GET_SHORT_FORM_BY_ID
} from './graphql/queries';

@Component({
  selector: 'oort-front-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {

  public formId: string | null = null;
  public form: FormQueryResponse['form'] | null = null;

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id');
    if (this.formId) {
      this.getFormQuery(this.formId ?? '').subscribe({
        next: (result) => {
          this.form = result.data.form;
          console.log('Form data:', this.form);
        },
      });
    }
  }

  /**
   * Returns a form query stream for the given id
   *
   * @param {string} id form id to fetch
   * @returns a query stream
   */
  private getFormQuery(id: string) {
    return this.apollo.query<FormQueryResponse>({
      query: GET_SHORT_FORM_BY_ID,
      variables: {
        id,
      },
    });
  }
}
