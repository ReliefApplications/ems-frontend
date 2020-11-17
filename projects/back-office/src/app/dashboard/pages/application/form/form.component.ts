import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Form, WhoFormComponent } from '@who-ems/builder';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../../graphql/queries';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  
  @ViewChild(WhoFormComponent)
  private formComponent: WhoFormComponent;

  // === DATA ===
  public loading = true;
  public id: string;
  public form: Form;
  public completed = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe(res => {
        this.loading = res.loading;
        this.form = res.data.form;
        console.log('init done')
      });
    }
  }

  onComplete(e: any): void {
    this.completed = e;
  }

  clearForm(): void {
    this.formComponent.reset();
  }

  editForm() {
    let id = this.route.snapshot.params.id;
    this.router.navigate(['./forms/builder/', id]);
  }
}