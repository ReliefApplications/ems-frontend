import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-role-summary',
  templateUrl: './role-summary.component.html',
  styleUrls: ['./role-summary.component.scss'],
})
export class RoleSummaryComponent implements OnInit {
  public id = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();
  }
}
