import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Page, WhoSnackBarService, WhoAuthService, ContentType } from 'who-shared';
import { GetPageByIdQueryResponse, GET_PAGE_BY_ID } from '../../../../graphql/queries';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  // === DATA ===
  public id: string;
  public page: Page;
  public content: string;
  public loading = true;
  public types = ContentType;

  // === PAGE NAME EDITION ===
  public formActive: boolean;
  public pageNameForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: WhoSnackBarService,
    private authService: WhoAuthService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.params.id;
    this.apollo.watchQuery<GetPageByIdQueryResponse>({
      query: GET_PAGE_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.page) {
        this.page = res.data.page;
        this.pageNameForm = new FormGroup({
          pageName: new FormControl(this.page.name, Validators.required)
        });
        this.loading = res.loading;
        this.content = res.data.page.content;
      } else {
        this.snackBar.openSnackBar('No access provided to this page.', { error: true });
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    },
      (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['..'], { relativeTo: this.route });
      })
  }

}
