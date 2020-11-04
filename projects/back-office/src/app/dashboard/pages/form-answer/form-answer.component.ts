import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'app-form-answer',
  templateUrl: './form-answer.component.html',
  styleUrls: ['./form-answer.component.scss']
})
export class FormAnswerComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id: string;
  public form: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe(res => {
        this.loading = res.loading;
        this.form = res.data.form;
      });
    }
  }
}
