import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PositionAttributes } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { GetPositionAttributesFromCategoryQueryResponse, GET_POSITION_ATTRIBUTES_FROM_CATEGORY } from '../../../graphql/queries';

@Component({
  selector: 'app-position',
  templateUrl: './position-attributes.component.html',
  styleUrls: ['./position-attributes.component.scss']
})
export class PositionAttributesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id: string;
  public categoryName = '';
  public displayedColumns = ['value', 'userCount'];
  public positionAttributes: PositionAttributes[] = [];

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.apollo.watchQuery<GetPositionAttributesFromCategoryQueryResponse>({
      query: GET_POSITION_ATTRIBUTES_FROM_CATEGORY,
      variables: {
        id: this.id,
      }
    }).valueChanges.subscribe(res => {
      this.positionAttributes = res.data.positionAttributes;
      this.loading = res.loading;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
