import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  FormComponent as SharedFormComponent,
  Form,
  FormQueryResponse,
} from '@oort-front/shared/widgets';
import { GET_SHORT_FORM_BY_ID } from '../graphql/queries';

/** Form component */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnChanges {
  @Input() id = '620236aa030f3a5e5db78319';

  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;

  // === DATA ===
  public loading = true;
  public form?: Form;
  public completed = false;
  public hideNewRecord = false;

  private getFormQuery = this.apollo.query<FormQueryResponse>({
    query: GET_SHORT_FORM_BY_ID,
    variables: {
      id: this.id,
    },
  });

  /**
   * Form component
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.getFormById();
  }

  ngOnChanges(): void {
    this.getFormById();
  }

  /**
   * Trigger get form query action
   */
  private getFormById() {
    this.getFormQuery.subscribe(({ data, loading }) => {
      if (data) {
        this.form = data.form;
        this.loading = loading;
      }
    });
  }

  /**
   * Complete form
   *
   * @param e completion event
   * @param e.completed is form completed
   * @param e.hideNewRecord is it needed to show 'new record' button
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  /**
   * Reset form.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
