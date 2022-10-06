import { Component, OnInit, Input } from '@angular/core';
import { Application } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  GET_APP_INFORMATIONS,
  GetAppInformationsByIdQueryResponse,
} from './graphql/queries';

/**
 * Component used to display application informations
 */
@Component({
  selector: 'app-card',
  templateUrl: './applications-card.component.html',
  styleUrls: ['./applications-card.component.scss'],
})
export class ApplicationsCardComponent implements OnInit {
  /** the application we want to display */
  @Input() application: Application | null = null;
  /** The user favorite page */
  @Input() favorite = '';
  /** String to display the number of pages */
  public numberOfPagesDisplay = '';
  /** String to display star or border_star */
  public star = '';
  /** Description of the application */
  public description = '';
  /** Number of pages of the application */
  private numberOfPages = 0;

  /**
   * Component used to display application informations
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /**
   * Request database for application informations
   * and process informations
   */
  ngOnInit(): void {
    if (this.favorite === this.application?.id) {
      this.star = 'star';
    } else {
      this.star = 'star_border';
    }

    this.apollo
      .query<GetAppInformationsByIdQueryResponse>({
        query: GET_APP_INFORMATIONS,
        variables: {
          id: this.application?.id,
        },
      })
      .subscribe((res) => {
        this.description = res.data.application.description;
        this.numberOfPages = res.data.application.pages.length;
        this.numberOfPagesDisplay = this.numberOfPages.toString();
        if (this.numberOfPages <= 1) {
          this.numberOfPagesDisplay += ' page';
        } else {
          this.numberOfPagesDisplay += ' pages';
        }
      });
  }
}
