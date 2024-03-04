import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Form, FormQueryResponse } from '../../../models/form.model';
import { RecordQueryResponse } from '../../../models/record.model';
import { firstValueFrom } from 'rxjs';
import { GET_SHORT_FORM_BY_ID } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormComponent } from '../../form/form.component';

/**
 * Form widget component.
 */
@Component({
  selector: 'shared-form-widget',
  templateUrl: './form-widget.component.html',
  styleUrls: ['./form-widget.component.scss'],
})
export class FormWidgetComponent implements OnInit {
  /** Widget settings */
  @Input() settings: any = null;
  /** Widget definition */
  @Input() widget: any;
  /** Should show padding */
  @Input() usePadding = true;
  /** Widget header template reference */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** Loaded form */
  public form!: Form;
  /** Loading state */
  public loading = true;
  /** Is form completed */
  public completed = false;
  /** Should possibility to add new records be hidden */
  public hideNewRecord = false;

  /** Form component */
  @ViewChild(FormComponent)
  private formComponent?: FormComponent;

  /**
   * Form widget component.
   *
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param translate This is the service that allows us to translate the text in our application.
   */
  constructor(
    private apollo: Apollo,
    protected snackBar: SnackbarService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    console.log('settings', this.settings);
    console.log('widget', this.widget);
    console.log('usePadding', this.usePadding);
    const promises: Promise<FormQueryResponse | RecordQueryResponse | void>[] =
      [];

    if (this.widget.settings.form) {
      promises.push(
        firstValueFrom(
          this.apollo.query<FormQueryResponse>({
            query: GET_SHORT_FORM_BY_ID,
            variables: {
              id: this.widget.settings.form,
            },
          })
        ).then(({ data, loading }) => {
          this.form = data.form;
          this.loading = loading;
        })
      );
    }
  }

  /**
   * Handles complete event.
   *
   * @param e complete event
   * @param e.completed is event completed
   * @param e.hideNewRecord do we need to hide new record
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  /**
   * Resets the form component.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
