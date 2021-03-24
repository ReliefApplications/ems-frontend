import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetRecordByIdQueryResponse, GET_RECORD_BY_ID } from '../../../graphql/queries';
import { Record } from '@who-ems/builder';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss']
})
export class UpdateRecordComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id: string;
  public record: Record;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
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

  goBack(): void {
    this._location.back();
  }
}
