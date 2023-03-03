import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * User Summary page component.
 */
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit {
  public id = '';

  /**
   * User summary page component.
   *
   * @param route Angular active route
   */
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();
  }
}
