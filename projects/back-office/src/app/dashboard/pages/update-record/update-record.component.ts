import {Apollo} from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GetRecordByIdQueryResponse, GET_RECORD_BY_ID } from '../../../graphql/queries';
import { Record } from '@safe/builder';

@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss']
})
export class UpdateRecordComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id = '';
  public record: Record = {};
  public backPath = '';

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.backPath = this.router.url.replace(`/update/${this.id}`, '');
    if (this.id !== null) {
      this.apollo.watchQuery<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe(res => {
        this.record = res.data.record;
        this.loading = res.loading;
      });
    }
  }
}
