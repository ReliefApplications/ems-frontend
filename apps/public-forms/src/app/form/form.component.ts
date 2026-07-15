import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, RestService } from '@oort-front/shared';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HeaderService } from '../services/header/header.service';

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
export class FormComponent implements OnInit, OnDestroy {
  /** Form id, from the url */
  public formId: string | null = null;
  /** Form to display */
  public form: Form | null = null;
  /**
   * Gets a captcha token by opening the captcha modal, called by the shared
   * form component when submitting. Undefined when no site key is configured.
   *
   * @returns The captcha token, or null if the challenge was not completed.
   */
  public requestCaptchaToken? = environment.captcha?.siteKey
    ? (): Promise<string | null> => this.openCaptchaModal()
    : undefined;

  /**
   * Form component. Displays a form based on the id in the url. If the form doesn't exist or an error occurs, we navigate back to the home page.
   *
   * @param route Used to get the form id from the url
   * @param router Used to navigate back to the home page if the form doesn't exist or an error occurs
   * @param restService Used to fetch the form from the public REST endpoint
   * @param headerService Used to display the form name in the application header
   * @param dialog Used to open the captcha modal when submitting the form
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private headerService: HeaderService,
    private dialog: Dialog
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
        this.headerService.setFormTitle(form.name ?? null);
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }

  /**
   * Opens the captcha modal and waits for the challenge to be completed.
   *
   * @returns The captcha token, or null if the modal was closed without
   * completing the challenge.
   */
  private async openCaptchaModal(): Promise<string | null> {
    const { CaptchaModalComponent } = await import(
      '../components/captcha-modal/captcha-modal.component'
    );
    const dialogRef = this.dialog.open<string | null>(CaptchaModalComponent, {
      data: { siteKey: environment.captcha?.siteKey },
      autoFocus: false,
    });
    return (await firstValueFrom(dialogRef.closed)) ?? null;
  }

  /** On destroy, restore the default application header title. */
  ngOnDestroy(): void {
    this.headerService.setFormTitle(null);
  }
}
