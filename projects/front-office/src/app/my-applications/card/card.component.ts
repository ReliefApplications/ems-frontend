import { Component, OnInit, Input } from '@angular/core';
import { Application } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  GET_APP_INFORMATIONS,
  GetAppInformationsByIdQueryResponse
} from './graphql/queries';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() application: Application | null = null;
  @Input() favorite: string = '';
  private numberOfPages = 0;
  public numberOfPagesDisplay = '';
  public star = '';
  public description = '';


  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if (this.favorite === this.application?.id){
      this.star = 'star';
    } else {
      this.star = 'star_border';
    }

    this.apollo.query<GetAppInformationsByIdQueryResponse>({
      query: GET_APP_INFORMATIONS,
      variables: {
        id: this.application?.id,
      },
    }).subscribe((res) => {
      this.description = res.data.application.description;
      this.numberOfPages = res.data.application.pages.length;
      this.numberOfPagesDisplay = this.numberOfPages.toString();
      if (this.numberOfPages <= 1) {
        this.numberOfPagesDisplay += ' page';
      } else {
        this.numberOfPagesDisplay += ' pages'
      }
    });
  }

}
