import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphQLSelectComponent } from './graphql-select.component';
import { GraphQLSelectModule } from './graphql-select.module';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';

/**
 * Testing component
 */
@Component({
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
      declarations: [TestingComponent],
      imports: [
        GraphQLSelectModule,
        FormWrapperModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('en', {
          components: {
            record: {
              convert: {
                select: 'Convert to',
              },
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component.graphQLComponent).toBeInstanceOf(GraphQLSelectComponent);
    expect(component).toBeTruthy();
  });
});
