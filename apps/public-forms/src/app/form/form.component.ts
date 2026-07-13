import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, RestService } from '@oort-front/shared';

/** Shape of a form returned by the public REST endpoint */
interface PublicForm {
  _id: string;
  name?: string;
  structure?: string;
  fields?: any[];
  status?: string;
  createdAt?: string;
  modifiedAt?: string;
}

/**
 * Public form page. Fetches the form matching the id in the url from the public REST endpoint and displays it.
 */
@Component({
  selector: 'oort-front-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  /** Form id, from the url */
  public formId: string | null = null;
  /** Form to display */
  public form: Form | null = null;

  /**
   * Form component. Displays a form based on the id in the url. If the form doesn't exist or an error occurs, we navigate back to the home page.
   *
   * @param route Used to get the form id from the url
   * @param router Used to navigate back to the home page if the form doesn't exist or an error occurs
   * @param restService Used to fetch the form from the public REST endpoint
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restService: RestService
  ) {}

  /**
   * On init, we get the form id from the url and fetch the form from the public REST endpoint,
   * which only exposes forms marked as public. If the form doesn't exist or an error occurs,
   * we navigate back to the home page.
   */
  ngOnInit(): void {
    this.formId = this.route.snapshot.paramMap.get('id');
    if (!this.formId || !/^[a-fA-F0-9]{24}$/.test(this.formId)) {
      this.router.navigate(['/']);
      return;
    }
    this.restService.get(`/public/forms/${this.formId}`).subscribe({
      next: (form: PublicForm) => {
        this.form = {
          id: form._id,
          name: form.name,
          structure: form.structure,
          fields: form.fields,
          status: form.status as Form['status'],
          metadata: [],
          canCreateRecords: true, // We force this to true as we want to allow anyone with the link to create records.
        };
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
