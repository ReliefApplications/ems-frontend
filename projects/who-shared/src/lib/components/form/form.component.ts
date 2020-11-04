import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD } from '../../graphql/mutations';
import { Form } from '../../models/form.model';

@Component({
  selector: 'who-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class WhoFormComponent implements OnInit {

  @Input() form: Form;
  @Output() save: EventEmitter<boolean> = new EventEmitter();

  // === SURVEYJS ===
  private survey: Survey.Model;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.survey = new Survey.Model(this.form.structure);
    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
  }

  /*  Custom SurveyJS method, save a new record.
  */
 public complete = (survey: any) => {
  this.apollo.mutate<AddRecordMutationResponse>({
    mutation: ADD_RECORD,
    variables: {
      form: this.form.id,
      data: survey.data
    }
  }).subscribe(() => {
    this.save.emit(true);
  });
}

}
