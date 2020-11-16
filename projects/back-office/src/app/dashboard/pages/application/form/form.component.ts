import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Form, WhoSnackBarService } from '@who-ems/builder';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../../graphql/queries';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public form: Form

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: WhoSnackBarService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.form) {
        this.form = res.data.form;
        this.loading = res.loading;
      } else {
        this.snackBar.openSnackBar('No access provided to this form.', { error: true });
      }
    },
    (err) => {
      this.snackBar.openSnackBar(err.message, { error: true });
    })
  }
}
