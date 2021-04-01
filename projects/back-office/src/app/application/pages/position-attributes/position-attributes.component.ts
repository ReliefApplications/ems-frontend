import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WhoSnackBarService } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-position',
  templateUrl: './position-attributes.component.html',
  styleUrls: ['./position-attributes.component.scss']
})
export class PositionAttributesComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id: string;
  public attributes: any;
  public displayedColumns = ['attribute', 'users'];

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: WhoSnackBarService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);    
  }
}
