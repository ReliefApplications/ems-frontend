import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
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

  /**
   * Form component. Displays a form based on the id in the url. If the form doesn't exist or an error occurs, we navigate back to the home page.
   * 
   * @param route Used to get the form id from the url
   * @param router Used to navigate back to the home page if the form doesn't exist or an error occurs
   * @param apollo Used to fetch the form from the backend
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo
  ) {}

  /**
   * On init, we get the form id from the url and fetch the form. If the form doesn't exist or an error occurs, we navigate back to the home page.
   */
  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id');
    if (!this.formId ||!/^[a-fA-F0-9]{24}$/.test(this.formId)) {
      this.router.navigate(['/']);
      return;
    } else {
      this.getFormQuery(this.formId ?? '').subscribe({
        next: (result) => {
          if (result.errors && result.errors.find((error) => error.message === 'Data not found')) {
            console.error('Error fetching form:', result.errors);
            this.router.navigate(['/']);
          }
          this.form = result.data.form;
          this.form.canCreateRecords = true; // We force this to true as we want to allow anyone with the link to create records.
          this.form.metadata = this.form.metadata || [];
        },
        error: (error) => {
          this.router.navigate(['/']);
        }
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
