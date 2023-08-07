import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphQLSelectComponent } from './graphql-select.component';
import { GraphQLSelectModule } from './graphql-select.module';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';
import { Component, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldModule } from '@progress/kendo-angular-inputs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

/**
 * Testing component
 */
@Component({
  standalone: true,
  template: ` <form [formGroup]="form">
    <div uiFormFieldDirective>
      <label>{{ 'components.record.convert.select' | translate }}</label>
      <ui-graphql-select
        valueField="id"
        textField="name"
        [query]="null"
        formControlName="formControl"
        [filterable]="true"
      ></ui-graphql-select>
    </div>
  </form>`,
  imports: [
    TranslateModule,
    GraphQLSelectModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
class TestingComponent {
  form = new FormGroup({
    formControl: new FormControl(''),
  });
  @ViewChild(GraphQLSelectComponent) graphQLComponent!: GraphQLSelectComponent;
}
describe('GraphQLSelectComponent', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        GraphQLSelectModule,
        TranslateMockModule,
        FormsModule,
        ReactiveFormsModule,
        FormFieldModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.graphQLComponent).toBeInstanceOf(GraphQLSelectComponent);
    expect(component).toBeTruthy();
  });
});
