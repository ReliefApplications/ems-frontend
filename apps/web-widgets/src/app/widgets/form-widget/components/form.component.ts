import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  FormComponent as SharedFormComponent,
  Form,
  FormQueryResponse,
} from '@oort-front/shared/widgets';
import { GET_SHORT_FORM_BY_ID } from '../graphql/queries';
import { ContextService, Record } from '@oort-front/shared';

/** Form component */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnChanges {
  /** Form id */
  @Input() id = '620236aa030f3a5e5db78319';

  /** Reference to the form component */
  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;

  // === DATA ===
  /** boolean to check wether page is still loading */
  public loading = true;
  /** Form */
  public form?: Form;
  /** Is the form completed */
  public completed = false;
  /** boolean, whether to hid or not the new record */
  public hideNewRecord = false;

  /** Get the form query */
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
   * @param contextService Shared context service
   */
  constructor(private apollo: Apollo, private contextService: ContextService) {}

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
   * @param e.completed is completed
   * @param e.hideNewRecord do we show new record button
   * @param e.record Saved record
   */
  onComplete(e: {
    completed: boolean;
    hideNewRecord?: boolean;
    record?: Record;
  }): void {
    if (e.record) {
      this.contextService.context = {
        ...e.record.data,
        id: e.record.id,
      };
    }
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
