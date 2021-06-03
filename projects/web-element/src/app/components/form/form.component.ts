import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SafeFormComponent, Form, Page, Step } from '@safe/builder';
import { GetFormByIdQueryResponse, GET_SHORT_FORM_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() id = '';

  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

  // === DATA ===
  public loading = true;
  public form?: Form;
  public completed = false;

  // === ROUTER ===
  public page?: Page;
  public step?: Step;

  // === ROUTE ===
  public isStep = false;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_SHORT_FORM_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data) {
        this.form = res.data.form;
        this.loading = res.loading;
      }
    });
  }

  onComplete(e: any): void {
    this.completed = e;
  }

  clearForm(): void {
    this.formComponent?.reset();
  }
}
