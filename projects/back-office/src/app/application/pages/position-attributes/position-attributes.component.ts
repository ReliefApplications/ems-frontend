import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public displayedColumns = ['value', 'usersCount'];
  public positionAttributes: PositionAttributes[] = [];
  public backPath: string;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.backPath = this.router.url.replace(`/${this.id}`, '');
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
}
